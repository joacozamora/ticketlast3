﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using TicketOn.Server.DTOs.Venta;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;
using MercadoPago.Client.Preference;
using MercadoPago.Resource.Preference;
using TicketOn.Server;

[ApiController]
[Route("api/ventas")]
public class VentaController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;
    private readonly IServicioUsuarios servicioUsuarios;

    public VentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
    {
        this.context = context;
        this.mapper = mapper;
        this.servicioUsuarios = servicioUsuarios;
    }

    [HttpPost]
    public async Task<ActionResult> Post(VentaCreacionDTO ventaCreacionDTO)
    {
        if (ventaCreacionDTO == null || ventaCreacionDTO.DetallesVenta == null || !ventaCreacionDTO.DetallesVenta.Any())
        {
            return BadRequest("Los detalles de la venta están vacíos o el formato es incorrecto.");
        }

        try
        {
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
            var venta = mapper.Map<Venta>(ventaCreacionDTO);
            venta.UsuarioId = usuarioId;
            venta.FechaVenta = DateTime.UtcNow;
            venta.Estado = "Pendiente";

            context.Add(venta);
            await context.SaveChangesAsync();

            var items = new List<PreferenceItemRequest>();
            foreach (var detalle in ventaCreacionDTO.DetallesVenta)
            {
                var entrada = await context.Entradas.Include(e => e.Evento).FirstOrDefaultAsync(e => e.Id == detalle.EntradaId);
                if (entrada == null)
                {
                    return NotFound($"No se encontró la entrada con ID {detalle.EntradaId}");
                }

                if (entrada.Stock < detalle.Cantidad)
                {
                    return BadRequest($"No hay suficiente stock para la entrada con ID {detalle.EntradaId}");
                }

                entrada.Stock -= detalle.Cantidad;

                var detalleVenta = new DetalleVenta
                {
                    EntradaId = detalle.EntradaId,
                    VentaId = venta.Id,
                    Cantidad = detalle.Cantidad,
                    PrecioVenta = entrada.Precio ?? 0m
                };

                context.DetallesVenta.Add(detalleVenta);

                items.Add(new PreferenceItemRequest
                {
                    Title = entrada.Evento.Nombre,
                    Quantity = detalle.Cantidad,
                    CurrencyId = "ARS",
                    UnitPrice = entrada.Precio ?? 0m
                });
            }

            await context.SaveChangesAsync();

            var preferenceRequest = new PreferenceRequest
            {
                Items = items,
                BackUrls = new PreferenceBackUrlsRequest
                {
                    Success = $"https://127.0.0.1:4200/confirmacion?ventaId={venta.Id}",
                    Failure = "https://127.0.0.1:4200/fallo",
                    Pending = "https://127.0.0.1:4200/pendiente"
                },
                AutoReturn = "approved",
                ExternalReference = venta.Id.ToString()
            };

            var client = new PreferenceClient();
            var preference = await client.CreateAsync(preferenceRequest);

            return Ok(new { VentaId = venta.Id, PreferenceId = preference.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error al procesar la venta: " + ex.Message);
        }
    }

    [HttpPost("confirmar/{ventaId}")]
    public async Task<ActionResult> ConfirmarVenta(int ventaId)
    {
        var venta = await context.Ventas
            .Include(v => v.DetallesVenta)
            .FirstOrDefaultAsync(v => v.Id == ventaId);

        if (venta == null)
        {
            return NotFound("La venta no existe.");
        }

        try
        {
            foreach (var detalle in venta.DetallesVenta)
            {
                for (int i = 0; i < detalle.Cantidad; i++)
                {
                    var entradaVenta = new EntradaVenta
                    {
                        EntradaId = detalle.EntradaId,
                        VentaId = venta.Id,
                        UsuarioId = venta.UsuarioId,
                        CodigoQR = string.Empty,
                        FechaAsignacion = DateTime.UtcNow,
                        PrecioVenta = detalle.PrecioVenta
                    };

                    context.EntradasVenta.Add(entradaVenta);
                    await context.SaveChangesAsync(); // Guardar para obtener el ID generado

                    // Generar y asignar el código QR
                    entradaVenta.CodigoQR = GenerarCodigoQR(entradaVenta);
                    context.EntradasVenta.Update(entradaVenta);
                }
            }

            // Cambiar el estado de la venta a "Aprobado"
            venta.Estado = "Aprobado";
            context.Ventas.Update(venta);

            await context.SaveChangesAsync();

            return Ok("Venta confirmada y entradas generadas correctamente.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error al confirmar la venta: " + ex.Message);
        }
    }


    [HttpPost("notificaciones")]
    public async Task<IActionResult> RecibirNotificacion([FromBody] dynamic notificacion)
    {
        string externalReference = notificacion?.external_reference;
        string status = notificacion?.status;

        if (!string.IsNullOrEmpty(externalReference))
        {
            int ventaId = int.Parse(externalReference);
            await ConfirmarVenta(ventaId);
        }

        return Ok();
    }

    private string GenerarCodigoQR(EntradaVenta entradaVenta)
    {
        var datos = $"ID Venta: {entradaVenta.VentaId}, ID EntradaVenta: {entradaVenta.Id}, ID Usuario: {entradaVenta.UsuarioId}";
        using (var sha256 = SHA256.Create())
        {
            var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(datos));
            return BitConverter.ToString(hash).Replace("-", "");
        }
    }
}



//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;
//using TicketOn.Server.DTOs.Venta;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;
//using MercadoPago.Client.Preference;
//using MercadoPago.Resource.Preference;
//using TicketOn.Server;

//[ApiController]
//[Route("api/ventas")]
//public class VentaController : ControllerBase
//{
//    private readonly ApplicationDbContext context;
//    private readonly IMapper mapper;
//    private readonly IServicioUsuarios servicioUsuarios;

//    public VentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
//    {
//        this.context = context;
//        this.mapper = mapper;
//        this.servicioUsuarios = servicioUsuarios;
//    }

//[HttpPost]
//public async Task<ActionResult> Post(VentaCreacionDTO ventaCreacionDTO)
//{

//    if (ventaCreacionDTO == null || ventaCreacionDTO.DetallesVenta == null || !ventaCreacionDTO.DetallesVenta.Any())
//    {
//        return BadRequest("Los detalles de la venta están vacíos o el formato es incorrecto.");
//    }

//    try
//    {
//        var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
//        var venta = mapper.Map<Venta>(ventaCreacionDTO);
//        venta.UsuarioId = usuarioId;
//        venta.FechaVenta = DateTime.UtcNow;
//        venta.Estado = "Pendiente"; // Estado inicial de la venta

//        context.Add(venta);
//        await context.SaveChangesAsync(); // Guardar la venta

//        // Preparar los items para Mercado Pago
//        var items = new List<PreferenceItemRequest>();
//        foreach (var detalle in ventaCreacionDTO.DetallesVenta)
//        {
//            var entrada = await context.Entradas.Include(e => e.Evento).FirstOrDefaultAsync(e => e.Id == detalle.EntradaId);
//            if (entrada == null)
//            {
//                return NotFound($"No se encontró la entrada con ID {detalle.EntradaId}");
//            }

//            if (entrada.Stock < detalle.Cantidad)
//            {
//                return BadRequest($"No hay suficiente stock para la entrada con ID {detalle.EntradaId}");
//            }

//            // Crear los detalles de la venta
//            var detalleVenta = new DetalleVenta
//            {
//                EntradaId = detalle.EntradaId,
//                VentaId = venta.Id,
//                Cantidad = detalle.Cantidad,
//                PrecioVenta = entrada.Precio ?? 0m
//            };

//            context.DetallesVenta.Add(detalleVenta);

//            items.Add(new PreferenceItemRequest
//            {
//                Title = entrada.Evento.Nombre,
//                Quantity = detalle.Cantidad,
//                CurrencyId = "ARS",
//                UnitPrice = entrada.Precio ?? 0m
//            });

//            // Reducir el stock
//            entrada.Stock -= detalle.Cantidad;
//            context.Entradas.Update(entrada);
//        }

//        await context.SaveChangesAsync(); // Guardar los detalles de la venta y actualizar el stock

//        // Crear preferencia en Mercado Pago
//        var preferenceRequest = new PreferenceRequest
//        {
//            Items = items,
//            BackUrls = new PreferenceBackUrlsRequest
//            {
//                Success = "https://127.0.0.1:4200/confirmacion?ventaId={venta.Id}",
//                Failure = "http://tu-url-de-failure.com",
//                Pending = "http://tu-url-de-pending.com"
//            },
//            AutoReturn = "approved",
//            ExternalReference = venta.Id.ToString() // Usar el ID de la venta como referencia
//        };

//        var client = new PreferenceClient();
//        var preference = await client.CreateAsync(preferenceRequest);

//        return Ok(new { VentaId = venta.Id, PreferenceId = preference.Id });
//    }
//    catch (Exception ex)
//    {
//        return StatusCode(500, "Error al procesar la venta: " + ex.Message);
//    }
//}

//    [HttpPost("confirmar/{ventaId}")]
//    public async Task<ActionResult> ConfirmarVenta(int ventaId)
//    {
//        Console.WriteLine($"ConfirmarVenta llamado para VentaId: {ventaId}");
//        var venta = await context.Ventas
//            .Include(v => v.DetallesVenta)
//            .FirstOrDefaultAsync(v => v.Id == ventaId);

//        if (venta == null || venta.Estado != "Pendiente")
//        {
//            return BadRequest("La venta no existe o ya fue confirmada.");
//        }

//        try
//        {
//            foreach (var detalle in venta.DetallesVenta)
//            {
//                for (int i = 0; i < detalle.Cantidad; i++)
//                {
//                    var entradaVenta = new EntradaVenta
//                    {
//                        EntradaId = detalle.EntradaId,
//                        VentaId = venta.Id,
//                        UsuarioId = venta.UsuarioId,
//                        CodigoQR = string.Empty, // Inicialmente vacío
//                        FechaAsignacion = DateTime.UtcNow,
//                        PrecioVenta = detalle.PrecioVenta
//                    };

//                    context.EntradasVenta.Add(entradaVenta);
//                    await context.SaveChangesAsync(); // Guardar para obtener el ID generado

//                    // Generar el QR
//                    entradaVenta.CodigoQR = GenerarCodigoQR(entradaVenta);
//                    context.EntradasVenta.Update(entradaVenta);
//                }
//            }

//            // Cambiar el estado de la venta
//            venta.Estado = "Completada";
//            context.Ventas.Update(venta);
//            await context.SaveChangesAsync();

//            return Ok("Venta confirmada correctamente.");
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, "Error al confirmar la venta: " + ex.Message);
//        }
//    }

//    [HttpPost("notificaciones")]
//    public async Task<IActionResult> RecibirNotificacion([FromBody] dynamic notificacion)
//    {
//        Console.WriteLine($"Notificación recibida: {notificacion}");

//        string externalReference = notificacion?.external_reference;
//        string status = notificacion?.status;

//        if (!string.IsNullOrEmpty(externalReference) && status == "approved")
//        {
//            int ventaId = int.Parse(externalReference);
//            await ConfirmarVenta(ventaId); // Confirmar la venta tras la aprobación
//        }

//        return Ok();
//    }

//    private string GenerarCodigoQR(EntradaVenta entradaVenta)
//    {
//        var datos = $"ID Venta: {entradaVenta.VentaId}, ID EntradaVenta: {entradaVenta.Id}, ID Usuario: {entradaVenta.UsuarioId}";
//        using (var sha256 = SHA256.Create())
//        {
//            var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(datos));
//            return BitConverter.ToString(hash).Replace("-", "");
//        }
//    }

//    [HttpGet("{id}")]
//    public async Task<ActionResult<VentaDTO>> GetById(int id)
//    {
//        var venta = await context.Ventas
//            .Include(v => v.DetallesVenta)
//            .ThenInclude(d => d.Entrada)
//            .ThenInclude(e => e.Evento)
//            .FirstOrDefaultAsync(v => v.Id == id);

//        if (venta == null)
//        {
//            return NotFound();
//        }

//        return Ok(mapper.Map<VentaDTO>(venta));
//    }
//}


//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;
//using TicketOn.Server.DTOs.Venta;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;
//using MercadoPago.Client.Preference;
//using MercadoPago.Resource.Preference;
//using TicketOn.Server;

//[ApiController]
//[Route("api/ventas")]
//public class VentaController : ControllerBase
//{
//    private readonly ApplicationDbContext context;
//    private readonly IMapper mapper;
//    private readonly IServicioUsuarios servicioUsuarios;

//    public VentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
//    {
//        this.context = context;
//        this.mapper = mapper;
//        this.servicioUsuarios = servicioUsuarios;
//    }

//    [HttpPost]
//    public async Task<ActionResult<VentaDTO>> Post(VentaCreacionDTO ventaCreacionDTO)
//    {
//        if (ventaCreacionDTO == null || ventaCreacionDTO.DetallesVenta == null || !ventaCreacionDTO.DetallesVenta.Any())
//        {
//            return BadRequest("Los detalles de la venta están vacíos o el formato es incorrecto.");
//        }

//        try
//        {
//            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
//            var venta = mapper.Map<Venta>(ventaCreacionDTO);
//            venta.UsuarioId = usuarioId;
//            venta.FechaVenta = DateTime.UtcNow;

//            context.Add(venta);
//            await context.SaveChangesAsync(); // Guardar la venta antes de crear las entradas

//            var items = new List<PreferenceItemRequest>();

//            foreach (var detalle in venta.DetallesVenta)
//            {
//                var entrada = await context.Entradas.Include(e => e.Evento).FirstOrDefaultAsync(e => e.Id == detalle.EntradaId);
//                if (entrada == null)
//                {
//                    throw new Exception($"No se encontró la entrada con ID {detalle.EntradaId}");
//                }

//                // Añadir al total para Mercado Pago
//                items.Add(new PreferenceItemRequest
//                {
//                    Title = entrada.Evento.Nombre,
//                    Quantity = detalle.Cantidad,
//                    CurrencyId = "ARS",
//                    UnitPrice = entrada.Precio ?? 0m
//                });

//                // Crear múltiples instancias de EntradaVenta basadas en la cantidad
//                for (int i = 0; i < detalle.Cantidad; i++)
//                {
//                    var entradaVenta = new EntradaVenta
//                    {
//                        EntradaId = detalle.EntradaId,
//                        VentaId = venta.Id,
//                        UsuarioId = usuarioId,
//                        CodigoQR = string.Empty, // Inicialmente vacío
//                        FechaAsignacion = DateTime.UtcNow
//                    };

//                    context.EntradasVenta.Add(entradaVenta); // Añadir a la base de datos
//                    await context.SaveChangesAsync(); // Guardar inmediatamente para obtener el ID generado



//                    // Generar el QR para la EntradaVenta recién creada
//                    entradaVenta.CodigoQR = GenerarCodigoQR(entrada, entradaVenta.Id, venta.Id); // Generar QR
//                    context.EntradasVenta.Update(entradaVenta); // Actualizar la entrada venta con el código QR
//                }
//                entrada.Stock -= detalle.Cantidad; // Restar la cantidad vendida
//                context.Entradas.Update(entrada); // Actualizar la entrada en la base de datos

//            }

//            await context.SaveChangesAsync(); // Guardar cambios después de actualizar los QR

//            var preferenceRequest = new PreferenceRequest
//            {
//                Items = items,
//                BackUrls = new PreferenceBackUrlsRequest
//                {
//                    Success = "http://tu-url-de-success.com",
//                    Failure = "http://tu-url-de-failure.com",
//                    Pending = "http://tu-url-de-pending.com"
//                },
//                AutoReturn = "approved"
//            };

//            var client = new PreferenceClient();
//            Preference preference = await client.CreateAsync(preferenceRequest);

//            return Ok(new { Venta = mapper.Map<VentaDTO>(venta), PreferenceId = preference.Id });
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, "Error al procesar la venta: " + ex.Message);
//        }
//    }

//    private string GenerarCodigoQR(Entrada entrada, int entradaVentaId, int ventaId)
//    {
//        var datos = $"Evento: {entrada.Evento.Nombre}, ID Entrada: {entrada.Id}, ID Venta: {ventaId}, ID EntradaVenta: {entradaVentaId}";
//        using (var sha256 = SHA256.Create())
//        {
//            var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(datos));
//            return BitConverter.ToString(hash).Replace("-", "");
//        }
//    }






//    [HttpGet("{id}")]
//    public async Task<ActionResult<VentaDTO>> GetById(int id)
//    {
//        var venta = await context.Ventas
//            .Include(v => v.DetallesVenta)
//            .ThenInclude(d => d.Entrada)
//            .ThenInclude(e => e.Evento)
//            .FirstOrDefaultAsync(v => v.Id == id);

//        if (venta == null)
//        {
//            return NotFound();
//        }

//        return Ok(mapper.Map<VentaDTO>(venta));
//    }



//}






//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;
//using TicketOn.Server.DTOs.Venta;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;
//using MercadoPago.Client.Preference;
//using MercadoPago.Resource.Preference;

//namespace TicketOn.Server.Controllers
//{
//    [ApiController]
//    [Route("api/ventas")]
//    public class VentaController : ControllerBase
//    {
//        private readonly ApplicationDbContext context;
//        private readonly IMapper mapper;
//        private readonly IServicioUsuarios servicioUsuarios;

//        public VentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
//        {
//            this.context = context;
//            this.mapper = mapper;
//            this.servicioUsuarios = servicioUsuarios;
//        }

//        [HttpPost]
//        public async Task<ActionResult<VentaDTO>> Post(VentaCreacionDTO ventaCreacionDTO)
//        {
//            if (ventaCreacionDTO == null || ventaCreacionDTO.DetallesVenta == null || !ventaCreacionDTO.DetallesVenta.Any())
//            {
//                return BadRequest("Los detalles de la venta están vacíos o el formato es incorrecto.");
//            }

//            try
//            {
//                var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

//                // Mapear a la entidad Venta y asignar datos adicionales
//                var venta = mapper.Map<Venta>(ventaCreacionDTO);
//                venta.UsuarioId = usuarioId;
//                venta.FechaVenta = DateTime.UtcNow;

//                context.Add(venta);
//                await context.SaveChangesAsync(); // Guardar la venta antes de crear la preferencia

//                // Crear items para Mercado Pago
//                var items = venta.DetallesVenta.Select(detalle => {
//                    var entrada = context.Entradas.Include(e => e.Evento).FirstOrDefault(e => e.Id == detalle.EntradaId);
//                    if (entrada == null)
//                    {
//                        throw new Exception($"No se encontró la entrada con ID {detalle.EntradaId}");
//                    }
//                    return new PreferenceItemRequest
//                    {
//                        Title = entrada.Evento.Nombre,
//                        Quantity = 1,
//                        CurrencyId = "ARS",
//                        UnitPrice = entrada.Precio ?? 0m
//                    };
//                }).ToList();

//                var preferenceRequest = new PreferenceRequest
//                {
//                    Items = items,
//                    BackUrls = new PreferenceBackUrlsRequest
//                    {
//                        Success = "http://tu-url-de-success.com",
//                        Failure = "http://tu-url-de-failure.com",
//                        Pending = "http://tu-url-de-pending.com"
//                    },
//                    AutoReturn = "approved"
//                };

//                var client = new PreferenceClient();
//                Preference preference = await client.CreateAsync(preferenceRequest);

//                // Agregar entradas a la billetera
//                foreach (var detalle in venta.DetallesVenta)
//                {
//                    var billetera = new Billetera
//                    {
//                        EntradaId = detalle.EntradaId,
//                        DetalleVentaId = detalle.Id,
//                        UsuarioId = usuarioId,
//                        CodigoQR = GenerarCodigoQR(detalle.Entrada),
//                        FechaAsignacion = DateTime.UtcNow
//                    };

//                    context.Billeteras.Add(billetera);
//                }
//                await context.SaveChangesAsync(); // Guardar la billetera después de agregar entradas

//                return Ok(new { Venta = mapper.Map<VentaDTO>(venta), PreferenceId = preference.Id });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, "Error al procesar la venta: " + ex.Message);
//            }
//        }


//        [HttpGet("{id}")]
//        public async Task<ActionResult<VentaDTO>> GetById(int id)
//        {
//            var venta = await context.Ventas
//                .Include(v => v.DetallesVenta)
//                .ThenInclude(d => d.Entrada)
//                .ThenInclude(e => e.Evento)
//                .FirstOrDefaultAsync(v => v.Id == id);

//            if (venta == null)
//            {
//                return NotFound();
//            }

//            return Ok(mapper.Map<VentaDTO>(venta));
//        }

//        private string GenerarCodigoQR(Entrada entrada)
//        {
//            var datos = $"Evento: {entrada.Evento.Nombre}, ID Entrada: {entrada.Id}";
//            using (var sha256 = SHA256.Create())
//            {
//                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(datos));
//                return BitConverter.ToString(hash).Replace("-", "");
//            }
//        }
//    }
//}




//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;
//using TicketOn.Server.DTOs.Venta;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;
//using MercadoPago.Client.Preference;
//using MercadoPago.Resource.Preference;

//namespace TicketOn.Server.Controllers
//{
//    [ApiController]
//    [Route("api/ventas")]
//    public class VentaController : ControllerBase
//    {
//        private readonly ApplicationDbContext context;
//        private readonly IMapper mapper;
//        private readonly IServicioUsuarios servicioUsuarios;

//        public VentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
//        {
//            this.context = context;
//            this.mapper = mapper;
//            this.servicioUsuarios = servicioUsuarios;
//        }

//[HttpPost]
//public async Task<ActionResult<VentaDTO>> Post(VentaCreacionDTO ventaCreacionDTO)
//{
//    if (ventaCreacionDTO == null || ventaCreacionDTO.DetallesVenta == null || !ventaCreacionDTO.DetallesVenta.Any())
//    {
//        return BadRequest("Los detalles de la venta están vacíos o el formato es incorrecto.");
//    }

//    try
//    {
//        var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

//        var venta = mapper.Map<Venta>(ventaCreacionDTO);
//        venta.UsuarioId = usuarioId;
//        venta.FechaVenta = DateTime.UtcNow;

//        context.Add(venta);
//        await context.SaveChangesAsync();

//        var items = venta.DetallesVenta.Select(detalle =>
//        {
//            var entrada = context.Entradas.Include(e => e.Evento).FirstOrDefault(e => e.Id == detalle.EntradaId);
//            if (entrada == null)
//            {
//                throw new Exception($"No se encontró la entrada con ID {detalle.EntradaId}");
//            }
//            return new PreferenceItemRequest
//            {
//                Title = entrada.Evento.Nombre,
//                Quantity = 1,
//                CurrencyId = "ARS",
//                UnitPrice = entrada.Precio ?? 0m
//            };
//        }).ToList();

//        var preferenceRequest = new PreferenceRequest
//        {
//            Items = items,
//            BackUrls = new PreferenceBackUrlsRequest
//            {
//                Success = "http://tu-url-de-success.com",
//                Failure = "http://tu-url-de-failure.com",
//                Pending = "http://tu-url-de-pending.com"
//            },
//            AutoReturn = "approved"
//        };

//        var client = new PreferenceClient();
//        Preference preference = await client.CreateAsync(preferenceRequest);

//        return Ok(new { Venta = mapper.Map<VentaDTO>(venta), PreferenceId = preference.Id });
//    }
//    catch (Exception ex)
//    {
//        return StatusCode(500, "Error al procesar la venta: " + ex.Message);
//    }
//}



//        [HttpGet("{id}")]
//        public async Task<ActionResult<VentaDTO>> GetById(int id)
//        {
//            var venta = await context.Ventas
//                .Include(v => v.DetallesVenta)
//                .ThenInclude(d => d.Entrada)
//                .ThenInclude(e => e.Evento)
//                .FirstOrDefaultAsync(v => v.Id == id);

//            if (venta == null)
//            {
//                return NotFound();
//            }

//            return Ok(mapper.Map<VentaDTO>(venta));
//        }

//        private string GenerarCodigoQR(Entrada entrada)
//        {
//            var datos = $"Evento: {entrada.Evento.Nombre}, Fecha: {DateTime.UtcNow}, ID Evento: {entrada.IdEvento}, " +
//                        $"ID Entrada: {entrada.Id}, Tanda: {entrada.NombreTanda}";

//            using (var sha256 = SHA256.Create())
//            {
//                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(datos));
//                return BitConverter.ToString(bytes).Replace("-", "");
//            }
//        }
//    }
//}


//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;
//using TicketOn.Server.DTOs.Venta;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;

//namespace TicketOn.Server.Controllers
//{
//    [ApiController]
//    [Route("api/ventas")]
//    public class VentaController : ControllerBase
//    {
//        private readonly ApplicationDbContext context;
//        private readonly IMapper mapper;
//        private readonly IServicioUsuarios servicioUsuarios;

//        public VentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
//        {
//            this.context = context;
//            this.mapper = mapper;
//            this.servicioUsuarios = servicioUsuarios;
//        }

//[HttpPost]
//public async Task<ActionResult<VentaDTO>> Post(VentaCreacionDTO ventaCreacionDTO)
//{
//    if (ventaCreacionDTO == null || ventaCreacionDTO.DetallesVenta == null || !ventaCreacionDTO.DetallesVenta.Any())
//    {
//        return BadRequest("Los detalles de la venta están vacíos o el formato es incorrecto.");
//    }

//    try
//    {
//        var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

//        // Mapear a la entidad Venta y asignar datos adicionales
//        var venta = mapper.Map<Venta>(ventaCreacionDTO);
//        venta.UsuarioId = usuarioId;
//        venta.FechaVenta = DateTime.UtcNow;

//        // Asegurarse de que la lista DetallesVenta esté inicializada
//        if (venta.DetallesVenta == null)
//        {
//            venta.DetallesVenta = new List<DetalleVenta>();
//        }

//        foreach (var detalle in venta.DetallesVenta)
//        {
//            var entrada = await context.Entradas.Include(e => e.Evento).FirstOrDefaultAsync(e => e.Id == detalle.EntradaId);

//            if (entrada == null)
//            {
//                return NotFound($"No se encontró la entrada con ID {detalle.EntradaId}");
//            }

//            detalle.PrecioVenta = entrada.Precio ?? 0;
//            detalle.Entrada = entrada;
//            detalle.CodigoQR = GenerarCodigoQR(entrada);
//        }

//        context.Add(venta);
//        await context.SaveChangesAsync();

//        // Registrar entradas en la billetera del usuario
//        foreach (var detalle in venta.DetallesVenta)
//        {
//            var billetera = new Billetera
//            {
//                EntradaId = detalle.EntradaId,
//                DetalleVentaId = detalle.Id,
//                UsuarioId = usuarioId,
//                CodigoQR = detalle.CodigoQR,
//                FechaAsignacion = DateTime.UtcNow
//            };

//            context.Billeteras.Add(billetera);
//        }

//        await context.SaveChangesAsync();

//        var ventaDTO = mapper.Map<VentaDTO>(venta);

//        return CreatedAtAction(nameof(GetById), new { id = venta.Id }, ventaDTO);
//    }
//    catch (Exception ex)
//    {
//        Console.WriteLine($"Error al confirmar la compra: {ex.Message}");
//        return StatusCode(500, "Ocurrió un error al confirmar la compra.");
//    }
//}

//        [HttpGet("{id}")]
//        public async Task<ActionResult<VentaDTO>> GetById(int id)
//        {
//            var venta = await context.Ventas
//                .Include(v => v.DetallesVenta)
//                .ThenInclude(d => d.Entrada)
//                .ThenInclude(e => e.Evento)
//                .FirstOrDefaultAsync(v => v.Id == id);

//            if (venta == null)
//            {
//                return NotFound();
//            }

//            var ventaDTO = mapper.Map<VentaDTO>(venta);

//            foreach (var detalleDTO in ventaDTO.DetallesVenta)
//            {
//                detalleDTO.NombreEntrada = detalleDTO.NombreEntrada ?? venta.DetallesVenta
//                    .FirstOrDefault(dv => dv.EntradaId == detalleDTO.EntradaId)?.Entrada.Evento.Nombre;
//            }

//            return ventaDTO;
//        }

//        // Función para generar el código QR cifrado
//        private string GenerarCodigoQR(Entrada entrada)
//        {
//            var codigoBase = $"Evento: {entrada.Evento.Nombre}, Fecha: {DateTime.UtcNow}, ID Evento: {entrada.IdEvento}, " +
//                             $"ID Entrada: {entrada.Id}, Tanda: {entrada.NombreTanda}";

//            using (var sha256 = SHA256.Create())
//            {
//                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(codigoBase));
//                var codigoQR = BitConverter.ToString(bytes).Replace("-", "");
//                return codigoQR;
//            }
//        }
//    }
//}
