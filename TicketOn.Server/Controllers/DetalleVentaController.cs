using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.DetalleVenta;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/detalles-venta")]
    public class DetalleVentaController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IServicioUsuarios servicioUsuarios;

        public DetalleVentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.mapper = mapper;
            this.servicioUsuarios = servicioUsuarios;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleVentaDTO>> GetById(int id)
        {
            var detalleVenta = await context.DetallesVenta
                .Include(d => d.Entrada)
                .ThenInclude(e => e.Evento)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detalleVenta == null)
            {
                return NotFound();
            }

            var detalleVentaDTO = mapper.Map<DetalleVentaDTO>(detalleVenta);
            detalleVentaDTO.NombreEntrada = detalleVenta.Entrada.NombreTanda ?? detalleVenta.Entrada.Evento.Nombre;

            return detalleVentaDTO;
        }

        // Nuevo endpoint para verificar el código QR
        [HttpPost("verificar-codigoQR")]
        public async Task<ActionResult> VerificarCodigoQR([FromBody] string codigoQR)
        {
            var detalleVenta = await context.DetallesVenta
                .Include(d => d.Entrada)
                .ThenInclude(e => e.Evento)
                .Include(d => d.Venta) // Incluimos la venta para obtener el UsuarioId si es necesario
                .FirstOrDefaultAsync(d => d.CodigoQR == codigoQR);

            if (detalleVenta == null)
            {
                return NotFound("El código QR no es válido o no corresponde a una entrada vendida.");
            }

            // Validación: verificar si el evento está activo o en una fecha válida
            var evento = detalleVenta.Entrada.Evento;
            if (evento.FechaInicio > DateTime.UtcNow)
            {
                return BadRequest("El evento aún no ha comenzado.");
            }
            if (evento.FechaFin < DateTime.UtcNow)
            {
                return BadRequest("El evento ya ha finalizado.");
            }

            // Opcional: Validar que el usuario autenticado sea el propietario de la entrada
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
            if (detalleVenta.Venta.UsuarioId != usuarioId)
            {
                return Unauthorized("Este código QR no pertenece al usuario autenticado.");
            }

            return Ok(new
            {
                Mensaje = "El código QR es válido.",
                Evento = evento.Nombre,
                FechaEvento = evento.FechaInicio,
                NombreTanda = detalleVenta.Entrada.NombreTanda
            });
        }
    }
}