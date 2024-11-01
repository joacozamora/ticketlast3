using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using TicketOn.Server.DTOs.Venta;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;
using MercadoPago.Client.Preference;
using MercadoPago.Resource.Preference;

namespace TicketOn.Server.Controllers
{
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
        public async Task<ActionResult<VentaDTO>> Post(VentaCreacionDTO ventaCreacionDTO)
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

                context.Add(venta);
                await context.SaveChangesAsync();

                var items = venta.DetallesVenta.Select(detalle =>
                {
                    var entrada = context.Entradas.Include(e => e.Evento).FirstOrDefault(e => e.Id == detalle.EntradaId);
                    if (entrada == null)
                    {
                        throw new Exception($"No se encontró la entrada con ID {detalle.EntradaId}");
                    }
                    return new PreferenceItemRequest
                    {
                        Title = entrada.Evento.Nombre,
                        Quantity = 1,
                        CurrencyId = "ARS",
                        UnitPrice = entrada.Precio ?? 0m
                    };
                }).ToList();

                var preferenceRequest = new PreferenceRequest
                {
                    Items = items,
                    BackUrls = new PreferenceBackUrlsRequest
                    {
                        Success = "http://tu-url-de-success.com",
                        Failure = "http://tu-url-de-failure.com",
                        Pending = "http://tu-url-de-pending.com"
                    },
                    AutoReturn = "approved"
                };

                var client = new PreferenceClient();
                Preference preference = await client.CreateAsync(preferenceRequest);

                return Ok(new { Venta = mapper.Map<VentaDTO>(venta), PreferenceId = preference.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al procesar la venta: " + ex.Message);
            }
        }

        

        [HttpGet("{id}")]
        public async Task<ActionResult<VentaDTO>> GetById(int id)
        {
            var venta = await context.Ventas
                .Include(v => v.DetallesVenta)
                .ThenInclude(d => d.Entrada)
                .ThenInclude(e => e.Evento)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (venta == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<VentaDTO>(venta));
        }

        private string GenerarCodigoQR(Entrada entrada)
        {
            var datos = $"Evento: {entrada.Evento.Nombre}, Fecha: {DateTime.UtcNow}, ID Evento: {entrada.IdEvento}, " +
                        $"ID Entrada: {entrada.Id}, Tanda: {entrada.NombreTanda}";

            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(datos));
                return BitConverter.ToString(bytes).Replace("-", "");
            }
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

//                // Asegurarse de que la lista DetallesVenta esté inicializada
//                if (venta.DetallesVenta == null)
//                {
//                    venta.DetallesVenta = new List<DetalleVenta>();
//                }

//                foreach (var detalle in venta.DetallesVenta)
//                {
//                    var entrada = await context.Entradas.Include(e => e.Evento).FirstOrDefaultAsync(e => e.Id == detalle.EntradaId);

//                    if (entrada == null)
//                    {
//                        return NotFound($"No se encontró la entrada con ID {detalle.EntradaId}");
//                    }

//                    detalle.PrecioVenta = entrada.Precio ?? 0;
//                    detalle.Entrada = entrada;
//                    detalle.CodigoQR = GenerarCodigoQR(entrada);
//                }

//                context.Add(venta);
//                await context.SaveChangesAsync();

//                // Registrar entradas en la billetera del usuario
//                foreach (var detalle in venta.DetallesVenta)
//                {
//                    var billetera = new Billetera
//                    {
//                        EntradaId = detalle.EntradaId,
//                        DetalleVentaId = detalle.Id,
//                        UsuarioId = usuarioId,
//                        CodigoQR = detalle.CodigoQR,
//                        FechaAsignacion = DateTime.UtcNow
//                    };

//                    context.Billeteras.Add(billetera);
//                }

//                await context.SaveChangesAsync();

//                var ventaDTO = mapper.Map<VentaDTO>(venta);

//                return CreatedAtAction(nameof(GetById), new { id = venta.Id }, ventaDTO);
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error al confirmar la compra: {ex.Message}");
//                return StatusCode(500, "Ocurrió un error al confirmar la compra.");
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
