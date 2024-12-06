using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.Reventas;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;

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
            if (reventaCreacionDTO == null)
            {
                return BadRequest("Los datos de la reventa están vacíos.");
            }

            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            // Validar que la entrada exista
            var entradaVenta = await context.EntradasVenta.FindAsync(reventaCreacionDTO.EntradaVentaId);
            if (entradaVenta == null)
            {
                return NotFound("La entrada a revender no existe.");
            }

            // Validar que la entrada pertenezca al usuario actual
            if (entradaVenta.UsuarioId != usuarioId)
            {
                return BadRequest("No puedes revender una entrada que no te pertenece.");
            }

            // Validar que no esté ya en una reventa activa
            var reventaExistente = await context.Reventas
                .FirstOrDefaultAsync(r => r.EntradaId == entradaVenta.EntradaId && r.Estado == "Disponible");

            if (reventaExistente != null)
            {
                return BadRequest("La entrada ya está en una reventa activa.");
            }

            // Crear la reventa
            var reventa = new Reventa
            {
                EntradaId = entradaVenta.EntradaId,
                UsuarioId = usuarioId,
                PrecioReventa = reventaCreacionDTO.PrecioReventa,
                Estado = "Disponible",
                FechaPublicacion = DateTime.UtcNow
            };

            context.Reventas.Add(reventa);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = reventa.Id }, mapper.Map<ReventaDTO>(reventa));
        }

        // Obtener una reventa específica
        [HttpGet("{id}")]
        public async Task<ActionResult<ReventaDTO>> GetById(int id)
        {
            var reventa = await context.Reventas
                .Include(r => r.Entrada)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reventa == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<ReventaDTO>(reventa));
        }

        // Listar reventas disponibles
        [HttpGet]
        public async Task<ActionResult<List<ReventaDTO>>> GetAll()
        {
            var reventas = await context.Reventas
                .Include(r => r.Entrada)
                .Where(r => r.Estado == "Disponible")
                .ToListAsync();

            return Ok(mapper.Map<List<ReventaDTO>>(reventas));
        }

        // Comprar una reventa
        [HttpPost("{id}/comprar")]
        public async Task<ActionResult> ComprarReventa(int id)
        {
            var usuarioCompradorId = await servicioUsuarios.ObtenerUsuarioId();

            // Obtener la reventa
            var reventa = await context.Reventas
                .Include(r => r.Entrada)
                .FirstOrDefaultAsync(r => r.Id == id && r.Estado == "Disponible");

            if (reventa == null)
            {
                return NotFound("La reventa no está disponible.");
            }

            // Cambiar el propietario de la entrada
            var entradaVenta = await context.EntradasVenta
                .FirstOrDefaultAsync(e => e.EntradaId == reventa.EntradaId);

            if (entradaVenta == null)
            {
                return NotFound("La entrada asociada no existe.");
            }

            entradaVenta.UsuarioId = usuarioCompradorId; // Asignar al nuevo dueño
            context.EntradasVenta.Update(entradaVenta);

            // Actualizar la reventa
            reventa.Estado = "Vendida";
            reventa.CompradorId = usuarioCompradorId;
            reventa.FechaReventa = DateTime.UtcNow;
            context.Reventas.Update(reventa);

            await context.SaveChangesAsync();

            return Ok("Reventa completada con éxito.");
        }

        // Cancelar una reventa
        [HttpPut("{id}/cancelar")]
        public async Task<ActionResult> CancelarReventa(int id)
        {
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            // Obtener la reventa
            var reventa = await context.Reventas.FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == usuarioId);
            if (reventa == null)
            {
                return NotFound("La reventa no existe o no te pertenece.");
            }

            // Actualizar el estado de la reventa
            reventa.Estado = "Cancelada";
            context.Reventas.Update(reventa);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
