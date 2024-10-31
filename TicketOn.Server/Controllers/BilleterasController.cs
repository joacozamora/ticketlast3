using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.Billetera;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/billetera")]
    public class BilleteraController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IServicioUsuarios servicioUsuarios;

        public BilleteraController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.mapper = mapper;
            this.servicioUsuarios = servicioUsuarios;
        }

        // Método para agregar una entrada a la billetera
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BilleteraCreacionDTO billeteraCreacionDTO)
        {
            // Verificar que la entrada y el detalle de venta existan
            var entrada = await context.Entradas.FindAsync(billeteraCreacionDTO.EntradaId);
            var detalleVenta = await context.DetallesVenta.FindAsync(billeteraCreacionDTO.DetalleVentaId);

            if (entrada == null || detalleVenta == null)
            {
                return BadRequest("La entrada o el detalle de venta especificados no existen.");
            }

            // Mapear el DTO a la entidad Billetera
            var billetera = new Billetera
            {
                EntradaId = billeteraCreacionDTO.EntradaId,
                DetalleVentaId = billeteraCreacionDTO.DetalleVentaId,
                UsuarioId = billeteraCreacionDTO.UsuarioId,
                CodigoQR = billeteraCreacionDTO.CodigoQR,
                FechaAsignacion = DateTime.UtcNow
            };

            context.Billeteras.Add(billetera);
            await context.SaveChangesAsync();

            return Ok("Entrada agregada a la billetera correctamente.");
        }

        [HttpGet("correo/{correo}")]
        public async Task<ActionResult<List<BilleteraDTO>>> GetBilleteraPorCorreo(string correo)
        {
            var usuario = await context.Users.FirstOrDefaultAsync(u => u.Email == correo);
            if (usuario == null)
            {
                return NotFound("No se encontró un usuario con ese correo.");
            }

            var entradasBilletera = await context.Billeteras
                .Where(b => b.UsuarioId == usuario.Id)
                .Include(b => b.Entrada)
                .ThenInclude(e => e.Evento)
                .ToListAsync();

            if (!entradasBilletera.Any())
            {
                return NotFound("No hay entradas en la billetera para este usuario.");
            }

            var entradasBilleteraDTO = mapper.Map<List<BilleteraDTO>>(entradasBilletera);
            return Ok(entradasBilleteraDTO);
        }

        // Método para obtener las entradas de la billetera de un usuario
        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<List<BilleteraDTO>>> GetBilleteraPorUsuario(string usuarioId)
        {
            var entradasBilletera = await context.Billeteras
                .Where(b => b.UsuarioId == usuarioId)
                .Include(b => b.Entrada)
                .ThenInclude(e => e.Evento)
                .ToListAsync();

            if (!entradasBilletera.Any())
            {
                return NotFound("No hay entradas en la billetera para este usuario.");
            }

            var entradasBilleteraDTO = mapper.Map<List<BilleteraDTO>>(entradasBilletera);
            return Ok(entradasBilleteraDTO);
        }
    }
}
