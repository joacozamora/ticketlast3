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

        [HttpPost]
        public async Task<ActionResult<ReventaDTO>> Post(ReventaCreacionDTO reventaCreacionDTO)
        {
            if (reventaCreacionDTO == null)
            {
                return BadRequest("Los datos de la reventa están vacíos.");
            }

            
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            
            var entradaVenta = await context.EntradasVenta.FindAsync(reventaCreacionDTO.EntradaVentaId);
            if (entradaVenta == null)
            {
                return NotFound("La entrada a revender no existe.");
            }

            
            var reventa = new Reventa
            {
                EntradaId = entradaVenta.EntradaId, 
                UsuarioId = usuarioId, 
                PrecioReventa = reventaCreacionDTO.PrecioReventa,
                FechaPublicacion = DateTime.UtcNow
            };

            context.Reventas.Add(reventa);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = reventa.Id }, mapper.Map<ReventaDTO>(reventa));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReventaDTO>> GetById(int id)
        {
            var reventa = await context.Reventas.FindAsync(id);
            if (reventa == null)
            {
                return NotFound();
            }
            return Ok(mapper.Map<ReventaDTO>(reventa));
        }

        [HttpGet]
        public async Task<ActionResult<List<ReventaDTO>>> GetAll()
        {
            var reventas = await context.Reventas
                                        .Include(r => r.Entrada) 
                                        .ToListAsync();

            return Ok(mapper.Map<List<ReventaDTO>>(reventas));
        }
    }
}
