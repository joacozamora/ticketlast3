using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.DetalleVenta;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/detalles-venta")]
    public class DetalleVentaController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public DetalleVentaController(ApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
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
    }
}