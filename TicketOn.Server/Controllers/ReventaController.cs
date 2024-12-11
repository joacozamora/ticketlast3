using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.Reventas;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;
using MercadoPago.Client.Preference;
using Newtonsoft.Json;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/reventas")]
    public class ReventaController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IServicioUsuarios servicioUsuarios;

        public ReventaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.mapper = mapper;
            this.servicioUsuarios = servicioUsuarios;
        }

        // Publicar una reventa
        [HttpPost]
        public async Task<ActionResult<ReventaDTO>> PublicarReventa(ReventaCreacionDTO reventaCreacionDTO)
        {
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            if (reventaCreacionDTO == null)
            {
                return BadRequest("Los datos de la reventa están vacíos.");
            }

            var entradaVenta = await context.EntradasVenta.FindAsync(reventaCreacionDTO.EntradaVentaId);
            if (entradaVenta == null || entradaVenta.UsuarioId != usuarioId)
            {
                return BadRequest("No puedes revender una entrada que no te pertenece o no existe.");
            }

            if (entradaVenta.EnReventa)
            {
                return BadRequest("La entrada ya está en una reventa activa.");
            }

            var reventa = new Reventa
            {
                EntradaVentaId = entradaVenta.Id,
                UsuarioId = usuarioId,
                PrecioReventa = reventaCreacionDTO.PrecioReventa,
                Estado = "Disponible",
                FechaPublicacion = DateTime.UtcNow
            };

            entradaVenta.EnReventa = true;
            context.EntradasVenta.Update(entradaVenta);
            context.Reventas.Add(reventa);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = reventa.Id }, mapper.Map<ReventaDTO>(reventa));
        }

        // Crear preferencia de pago para la reventa
        [HttpPost("crear-preferencia/{reventaId}")]
        public async Task<IActionResult> CrearPreferenciaReventa(int reventaId)
        {
            try
            {
                var reventa = await context.Reventas
                    .Include(r => r.EntradaVenta)
                    .ThenInclude(ev => ev.Entrada)
                    .ThenInclude(e => e.Evento)
                    .FirstOrDefaultAsync(r => r.Id == reventaId && r.Estado == "Disponible");

                if (reventa == null)
                {
                    return NotFound("La reventa no está disponible.");
                }

                var vendedor = await context.UsuarioMercadoPago
                    .FirstOrDefaultAsync(ump => ump.UsuarioId == reventa.UsuarioId);

                if (vendedor == null || string.IsNullOrEmpty(vendedor.AccessToken))
                {
                    return BadRequest("El vendedor no tiene una cuenta válida de MercadoPago.");
                }

                var items = new List<PreferenceItemRequest>
                {
                    new PreferenceItemRequest
                    {
                        Title = reventa.EntradaVenta.Entrada.Evento.Nombre ?? "Evento sin nombre",
                        Quantity = 1,
                        CurrencyId = "ARS",
                        UnitPrice = reventa.PrecioReventa
                    }
                };

                var backUrls = new PreferenceBackUrlsRequest
                {
                    Success = $"https://127.0.0.1:4200/confirmacion-reventa?reventaId={reventa.Id}",
                    Failure = "https://127.0.0.1:4200/error-reventa",
                    Pending = "https://127.0.0.1:4200/pendiente-reventa"
                };

                var preferenceRequest = new PreferenceRequest
                {
                    Items = items,
                    BackUrls = backUrls,
                    AutoReturn = "approved",
                    ExternalReference = reventa.Id.ToString()
                };

                var requestOptions = new MercadoPago.Client.RequestOptions
                {
                    AccessToken = vendedor.AccessToken
                };

                var client = new PreferenceClient();
                var preference = await client.CreateAsync(preferenceRequest, requestOptions);

                if (preference == null || string.IsNullOrEmpty(preference.Id))
                {
                    return StatusCode(500, "No se pudo generar un PreferenceId válido.");
                }

                return Ok(new { preferenceId = preference.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear la preferencia: {ex.Message}");
            }
        }

        // Confirmar reventa tras el pago
        [HttpPost("confirmar/{reventaId}")]
        public async Task<IActionResult> ConfirmarReventa(int reventaId)
        {
            try
            {
                var reventa = await context.Reventas
                    .Include(r => r.EntradaVenta)
                    .FirstOrDefaultAsync(r => r.Id == reventaId && r.Estado == "Disponible");

                if (reventa == null)
                {
                    return NotFound("La reventa no está disponible o ya fue completada.");
                }

                var compradorId = await servicioUsuarios.ObtenerUsuarioId();

                var entradaVenta = reventa.EntradaVenta;
                if (entradaVenta == null)
                {
                    return NotFound("La entrada asociada no existe.");
                }

                entradaVenta.UsuarioId = compradorId;
                entradaVenta.EnReventa = false;
                context.EntradasVenta.Update(entradaVenta);

                reventa.Estado = "Vendida";
                reventa.CompradorId = compradorId;
                reventa.FechaReventa = DateTime.UtcNow;
                context.Reventas.Update(reventa);

                await context.SaveChangesAsync();
                return Ok("Reventa confirmada con éxito.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al confirmar la reventa: {ex.Message}");
            }
        }

        // Obtener una reventa específica
        [HttpGet("{id}")]
        public async Task<ActionResult<ReventaDTO>> GetById(int id)
        {
            var reventa = await context.Reventas
                .Include(r => r.EntradaVenta)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reventa == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<ReventaDTO>(reventa));
        }

        // Listar todas las reventas disponibles
        [HttpGet]
        public async Task<ActionResult<List<ReventaDTO>>> GetAll()
        {
            try
            {
                var reventas = await context.Reventas
                    .Include(r => r.EntradaVenta)
                        .ThenInclude(ev => ev.Entrada)
                        .ThenInclude(e => e.Evento)
                    .Where(r => r.Estado == "Disponible")
                    .ToListAsync();

                var reventasDTO = reventas.Select(r => new ReventaDTO
                {
                    Id = r.Id,
                    Estado = r.Estado,
                    EntradaVentaId = r.EntradaVentaId,
                    PrecioReventa = r.PrecioReventa,
                    UsuarioId = r.UsuarioId,
                    CompradorId = r.CompradorId,
                    FechaReventa = r.FechaReventa,
                    NombreEvento = r.EntradaVenta.Entrada.Evento.Nombre,
                    ImagenEvento = r.EntradaVenta.Entrada.Evento.Imagen
                }).ToList();

                return Ok(reventasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener las reventas: {ex.Message}");
            }
        }

        // Cancelar una reventa
        [HttpPut("{id}/cancelar")]
        public async Task<ActionResult> CancelarReventa(int id)
        {
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            var reventa = await context.Reventas
                .FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == usuarioId);

            if (reventa == null)
            {
                return NotFound("La reventa no existe o no te pertenece.");
            }

            var entradaVenta = await context.EntradasVenta.FirstOrDefaultAsync(e => e.Id == reventa.EntradaVentaId);
            if (entradaVenta != null)
            {
                entradaVenta.EnReventa = false;
                context.EntradasVenta.Update(entradaVenta);
            }

            reventa.Estado = "Cancelada";
            context.Reventas.Update(reventa);

            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}



//using AutoMapper;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using TicketOn.Server.DTOs.Reventas;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;
//using MercadoPago.Client.Preference;
//using Newtonsoft.Json;

//namespace TicketOn.Server.Controllers
//{
//    [ApiController]
//    [Route("api/reventas")]
//    public class ReventaController : ControllerBase
//    {
//        private readonly ApplicationDbContext context;
//        private readonly IMapper mapper;
//        private readonly IServicioUsuarios servicioUsuarios;

//        public ReventaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
//        {
//            this.context = context;
//            this.mapper = mapper;
//            this.servicioUsuarios = servicioUsuarios;
//        }

//        // Publicar una reventa
//        [HttpPost]
//        public async Task<ActionResult<ReventaDTO>> PublicarReventa(ReventaCreacionDTO reventaCreacionDTO)
//        {
//            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

//            if (reventaCreacionDTO == null)
//            {
//                return BadRequest("Los datos de la reventa están vacíos.");
//            }

//            var entradaVenta = await context.EntradasVenta.FindAsync(reventaCreacionDTO.EntradaVentaId);
//            if (entradaVenta == null || entradaVenta.UsuarioId != usuarioId)
//            {
//                return BadRequest("No puedes revender una entrada que no te pertenece o no existe.");
//            }

//            if (entradaVenta.EnReventa)
//            {
//                return BadRequest("La entrada ya está en una reventa activa.");
//            }

//            var reventa = new Reventa
//            {
//                EntradaVentaId = entradaVenta.Id,
//                UsuarioId = usuarioId,
//                PrecioReventa = reventaCreacionDTO.PrecioReventa,
//                Estado = "Disponible",
//                FechaPublicacion = DateTime.UtcNow
//            };

//            entradaVenta.EnReventa = true;
//            context.EntradasVenta.Update(entradaVenta);
//            context.Reventas.Add(reventa);
//            await context.SaveChangesAsync();

//            return CreatedAtAction(nameof(GetById), new { id = reventa.Id }, mapper.Map<ReventaDTO>(reventa));
//        }

//        [HttpPost("crear-preferencia/{reventaId}")]
//        public async Task<IActionResult> CrearPreferenciaReventa(int reventaId)
//        {
//            try
//            {
//                // Buscar la reventa y sus relaciones necesarias
//                var reventa = await context.Reventas
//                    .Include(r => r.EntradaVenta)
//                    .ThenInclude(ev => ev.Entrada)
//                    .ThenInclude(e => e.Evento)
//                    .FirstOrDefaultAsync(r => r.Id == reventaId && r.Estado == "Disponible");

//                if (reventa == null)
//                {
//                    return NotFound("La reventa no está disponible.");
//                }

//                // Buscar al vendedor en la tabla UsuarioMercadoPago
//                var vendedor = await context.UsuarioMercadoPago
//                    .FirstOrDefaultAsync(ump => ump.UsuarioId == reventa.UsuarioId);

//                if (vendedor == null || string.IsNullOrEmpty(vendedor.AccessToken))
//                {
//                    return BadRequest("El vendedor no tiene una cuenta válida de MercadoPago.");
//                }

//                // Crear los ítems para la preferencia
//                var items = new List<PreferenceItemRequest>
//        {
//            new PreferenceItemRequest
//            {
//                Title = reventa.EntradaVenta.Entrada.Evento.Nombre ?? "Evento sin nombre",
//                Quantity = 1,
//                CurrencyId = "ARS",
//                UnitPrice = reventa.PrecioReventa
//            }
//        };

//                // Configurar las URLs de redirección
//                var backUrls = new PreferenceBackUrlsRequest
//                {
//                    Success = $"https://127.0.0.1:4200/confirmacion-reventa?reventaId={reventa.Id}",
//                    Failure = "https://127.0.0.1:4200/error-reventa",
//                    Pending = "https://127.0.0.1:4200/pendiente-reventa"
//                };

//                // Crear la solicitud de preferencia
//                var preferenceRequest = new PreferenceRequest
//                {
//                    Items = items,
//                    BackUrls = backUrls,
//                    AutoReturn = "approved",
//                    ExternalReference = reventa.Id.ToString()
//                };

//                // Configurar las opciones de autenticación para el cliente de MercadoPago
//                var requestOptions = new MercadoPago.Client.RequestOptions
//                {
//                    AccessToken = vendedor.AccessToken
//                };

//                // Crear la preferencia a través de la API de MercadoPago
//                var client = new PreferenceClient();
//                var preference = await client.CreateAsync(preferenceRequest, requestOptions);

//                if (preference == null || string.IsNullOrEmpty(preference.Id))
//                {
//                    return StatusCode(500, "No se pudo generar un PreferenceId válido.");
//                }

//                // Retornar el ID de la preferencia generada
//                return Ok(new { preferenceId = preference.Id });
//            }
//            catch (Exception ex)
//            {
//                // Manejar cualquier error inesperado
//                return StatusCode(500, $"Error al crear la preferencia: {ex.Message}");
//            }


//        }



//        // Confirmar una reventa tras el pago
//        [HttpPost("confirmar/{reventaId}")]
//        public async Task<IActionResult> ConfirmarReventa(int reventaId)
//        {
//            try
//            {
//                // Validar que la reventa existe y está en proceso
//                var reventa = await context.Reventas
//                    .Include(r => r.EntradaVenta)
//                    .FirstOrDefaultAsync(r => r.Id == reventaId && r.Estado == "Disponible");

//                if (reventa == null)
//                {
//                    return NotFound("La reventa no está disponible o ya fue completada.");
//                }

//                var compradorId = await servicioUsuarios.ObtenerUsuarioId();

//                // Actualizar la propiedad de la entrada
//                var entradaVenta = await context.EntradasVenta.FirstOrDefaultAsync(e => e.Id == reventa.EntradaVentaId);

//                if (entradaVenta == null)
//                {
//                    return NotFound("La entrada asociada no existe.");
//                }

//                entradaVenta.UsuarioId = compradorId;
//                entradaVenta.EnReventa = false;
//                context.EntradasVenta.Update(entradaVenta);

//                // Marcar la reventa como completada
//                reventa.Estado = "Vendida";
//                reventa.CompradorId = compradorId;
//                reventa.FechaReventa = DateTime.UtcNow;
//                context.Reventas.Update(reventa);

//                await context.SaveChangesAsync();
//                return Ok("Reventa confirmada con éxito.");
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error al confirmar la reventa: {ex.Message}");
//            }
//        }

//        // Obtener una reventa específica
//        [HttpGet("{id}")]
//        public async Task<ActionResult<ReventaDTO>> GetById(int id)
//        {
//            var reventa = await context.Reventas
//                .Include(r => r.EntradaVenta)
//                .FirstOrDefaultAsync(r => r.Id == id);

//            if (reventa == null)
//            {
//                return NotFound();
//            }

//            return Ok(mapper.Map<ReventaDTO>(reventa));
//        }

//        // Listar todas las reventas disponibles
//        [HttpGet]
//        public async Task<ActionResult<List<ReventaDTO>>> GetAll()
//        {
//            try
//            {
//                var reventas = await context.Reventas
//                    .Include(r => r.EntradaVenta) // Incluir EntradaVenta
//                        .ThenInclude(ev => ev.Entrada) // Relación con Entrada
//                        .ThenInclude(e => e.Evento)   // Relación con Evento
//                    .Where(r => r.Estado == "Disponible")
//                    .ToListAsync();

//                // Mapear a ReventaDTO, asegurando que se obtenga el nombre e imagen del evento
//                var reventasDTO = reventas.Select(r => new ReventaDTO
//                {
//                    Id = r.Id,
//                    Estado = r.Estado,
//                    EntradaVentaId = r.EntradaVentaId,
//                    PrecioReventa = r.PrecioReventa,
//                    UsuarioId = r.UsuarioId,
//                    CompradorId = r.CompradorId,
//                    FechaReventa = r.FechaReventa,
//                    NombreEvento = r.EntradaVenta.Entrada.Evento.Nombre, // Nombre del evento
//                    ImagenEvento = r.EntradaVenta.Entrada.Evento.Imagen  // Imagen del evento
//                }).ToList();

//                return Ok(reventasDTO);
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error al obtener las reventas: {ex.Message}");
//                return StatusCode(500, "Error al obtener las reventas.");
//            }
//        }


//        // Cancelar una reventa
//        [HttpPut("{id}/cancelar")]
//        public async Task<ActionResult> CancelarReventa(int id)
//        {
//            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

//            var reventa = await context.Reventas
//                .FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == usuarioId);

//            if (reventa == null)
//            {
//                return NotFound("La reventa no existe o no te pertenece.");
//            }

//            var entradaVenta = await context.EntradasVenta.FirstOrDefaultAsync(e => e.Id == reventa.EntradaVentaId);
//            if (entradaVenta != null)
//            {
//                entradaVenta.EnReventa = false;
//                context.EntradasVenta.Update(entradaVenta);
//            }

//            reventa.Estado = "Cancelada";
//            context.Reventas.Update(reventa);

//            await context.SaveChangesAsync();
//            return NoContent();
//        }
//    }
//}


//using AutoMapper;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using TicketOn.Server.DTOs.Reventas;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;

//namespace TicketOn.Server.Controllers
//{
//    [ApiController]
//    [Route("api/reventas")]
//    public class ReventaController : ControllerBase
//    {
//        private readonly ApplicationDbContext context;
//        private readonly IMapper mapper;
//        private readonly IServicioUsuarios servicioUsuarios;

//        public ReventaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
//        {
//            this.context = context;
//            this.mapper = mapper;
//            this.servicioUsuarios = servicioUsuarios;
//        }

//        [HttpPost]
//        public async Task<ActionResult<ReventaDTO>> PublicarReventa(ReventaCreacionDTO reventaCreacionDTO)
//        {
//            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();



//            if (reventaCreacionDTO == null)
//            {
//                return BadRequest("Los datos de la reventa están vacíos.");
//            }

//            if (reventaCreacionDTO.EntradaVentaId <= 0)
//            {
//                return BadRequest("El ID de la entrada a revender no es válido.");
//            }


//            var entradaVenta = await context.EntradasVenta.FindAsync(reventaCreacionDTO.EntradaVentaId);
//            if (entradaVenta == null)
//            {
//                return NotFound("La entrada a revender no existe.");
//            }

//            if (entradaVenta.UsuarioId != usuarioId)
//            {
//                return BadRequest("No puedes revender una entrada que no te pertenece.");
//            }

//            if (entradaVenta.EnReventa)
//            {
//                return BadRequest("La entrada ya está en una reventa activa.");
//            }

//            var reventa = new Reventa
//            {
//                EntradaId = entradaVenta.EntradaId,
//                UsuarioId = usuarioId,
//                PrecioReventa = reventaCreacionDTO.PrecioReventa,
//                Estado = "Disponible",
//                FechaPublicacion = DateTime.UtcNow
//            };

//            entradaVenta.EnReventa = true;
//            context.EntradasVenta.Update(entradaVenta);

//            context.Reventas.Add(reventa);
//            await context.SaveChangesAsync();

//            return CreatedAtAction(nameof(GetById), new { id = reventa.Id }, mapper.Map<ReventaDTO>(reventa));
//        }


//        // Obtener una reventa específica
//        [HttpGet("{id}")]
//        public async Task<ActionResult<ReventaDTO>> GetById(int id)
//        {
//            var reventa = await context.Reventas
//                .Include(r => r.Entrada)
//                .FirstOrDefaultAsync(r => r.Id == id);

//            if (reventa == null)
//            {
//                return NotFound();
//            }

//            return CreatedAtAction(nameof(GetById), new { id = reventa.Id }, mapper.Map<ReventaDTO>(reventa));
//        }

//        // Listar reventas disponibles
//        [HttpGet]
//        public async Task<ActionResult<List<ReventaDTO>>> GetAll()
//        {
//            var reventas = await context.Reventas
//                .Include(r => r.Entrada)
//                .Where(r => r.Estado == "Disponible")
//                .ToListAsync();

//            return Ok(mapper.Map<List<ReventaDTO>>(reventas));
//        }

//        // Comprar una reventa
//        [HttpPost("{id}/comprar")]
//        public async Task<ActionResult> ComprarReventa(int id)
//        {
//            var usuarioCompradorId = await servicioUsuarios.ObtenerUsuarioId();

//            // Obtener la reventa
//            var reventa = await context.Reventas
//                .Include(r => r.Entrada)
//                .FirstOrDefaultAsync(r => r.Id == id && r.Estado == "Disponible");

//            if (reventa == null)
//            {
//                return NotFound("La reventa no está disponible.");
//            }

//            // Cambiar el propietario de la entrada
//            var entradaVenta = await context.EntradasVenta
//                .FirstOrDefaultAsync(e => e.EntradaId == reventa.EntradaId);

//            if (entradaVenta == null)
//            {
//                return NotFound("La entrada asociada no existe.");
//            }

//            entradaVenta.UsuarioId = usuarioCompradorId; // Asignar al nuevo dueño
//            entradaVenta.EnReventa = false; // Marcar como no en reventa
//            context.EntradasVenta.Update(entradaVenta);

//            // Actualizar la reventa
//            reventa.Estado = "Vendida";
//            reventa.CompradorId = usuarioCompradorId;
//            reventa.FechaReventa = DateTime.UtcNow;
//            context.Reventas.Update(reventa);

//            await context.SaveChangesAsync();

//            return Ok("Reventa completada con éxito.");
//        }


//        // Cancelar una reventa
//        [HttpPut("{id}/cancelar")]
//        public async Task<ActionResult> CancelarReventa(int id)
//        {
//            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

//            // Obtener la reventa
//            var reventa = await context.Reventas
//                .FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == usuarioId);

//            if (reventa == null)
//            {
//                return NotFound("La reventa no existe o no te pertenece.");
//            }

//            // Actualizar el estado de la reventa
//            reventa.Estado = "Cancelada";
//            context.Reventas.Update(reventa);

//            // Cambiar el estado de la entrada
//            var entradaVenta = await context.EntradasVenta
//                .FirstOrDefaultAsync(e => e.EntradaId == reventa.EntradaId);

//            if (entradaVenta != null)
//            {
//                entradaVenta.EnReventa = false;
//                context.EntradasVenta.Update(entradaVenta);
//            }

//            await context.SaveChangesAsync();

//            return NoContent();
//        }
//    }
//}
