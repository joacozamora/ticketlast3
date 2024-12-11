using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.EntradasVenta;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/entradas-venta")]
    public class EntradaVentaController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IServicioUsuarios servicioUsuarios;

        public EntradaVentaController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.mapper = mapper;
            this.servicioUsuarios = servicioUsuarios;
        }

        [HttpGet("correo/{correo}")]
        public async Task<ActionResult<List<EntradaVentaDTO>>> ObtenerEntradasPorCorreo(string correo)
        {
            var usuario = await context.Users.FirstOrDefaultAsync(u => u.Email == correo);
            if (usuario == null)
            {
                return NotFound("No se encontró un usuario con ese correo.");
            }

            var entradasVenta = await context.EntradasVenta
                .Where(ev => ev.UsuarioId == usuario.Id && !ev.EnReventa) // Filtrar entradas que no están en reventa
                .Include(ev => ev.Entrada)
                    .ThenInclude(e => e.Evento)
                .ToListAsync();

            if (!entradasVenta.Any())
            {
                return NotFound("No hay entradas disponibles para este usuario.");
            }

            var entradasVentaDTO = entradasVenta.Select(ev => new EntradaVentaDTO
            {
                Id = ev.Id,
                EntradaId = ev.EntradaId,
                VentaId = ev.VentaId,
                UsuarioId = ev.UsuarioId,
                CodigoQR = ev.CodigoQR,
                FechaAsignacion = ev.FechaAsignacion,
                NombreEntrada = ev.Entrada.NombreTanda,
                ImagenEvento = ev.Entrada.Evento.Imagen ?? "default.jpg",
                Correo = ev.Entrada.CorreoOrganizador ?? "Correo no disponible" // Asegurarse de manejar nulos
            }).ToList();

            return Ok(entradasVentaDTO);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<EntradaVentaDTO>> GetById(int id)
        {
            var entradaVenta = await context.EntradasVenta
                .Include(ev => ev.Entrada)
                .Include(ev => ev.Venta)
                .FirstOrDefaultAsync(ev => ev.Id == id);

            if (entradaVenta == null)
            {
                return NotFound("No se encontró la entrada venta.");
            }

            var entradaVentaDTO = new EntradaVentaDTO
            {
                Id = entradaVenta.Id,
                EntradaId = entradaVenta.EntradaId,
                VentaId = entradaVenta.VentaId,
                UsuarioId = entradaVenta.UsuarioId,
                CodigoQR = entradaVenta.CodigoQR,
                FechaAsignacion = entradaVenta.FechaAsignacion,
                NombreEntrada = entradaVenta.Entrada?.NombreTanda ?? "Nombre no disponible",
                ImagenEvento = entradaVenta.Entrada?.Evento?.Imagen ?? "default.jpg",
                Correo = entradaVenta.Entrada?.CorreoOrganizador ?? "Correo no disponible"
            };

            return Ok(entradaVentaDTO);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] EntradaVentaCreacionDTO entradaVentaCreacionDTO)
        {
            if (entradaVentaCreacionDTO == null)
            {
                return BadRequest("Los datos de la entrada venta son inválidos.");
            }

            var entradaVenta = await context.EntradasVenta.FindAsync(id);
            if (entradaVenta == null)
            {
                return NotFound("No se encontró la entrada venta.");
            }

            entradaVenta.EntradaId = entradaVentaCreacionDTO.EntradaId;
            entradaVenta.VentaId = entradaVentaCreacionDTO.VentaId;
            entradaVenta.UsuarioId = entradaVentaCreacionDTO.UsuarioId;
            entradaVenta.CodigoQR = entradaVentaCreacionDTO.CodigoQR;
            entradaVenta.FechaAsignacion = DateTime.UtcNow;

            await context.SaveChangesAsync();
            return NoContent(); // 204 No Content
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entradaVenta = await context.EntradasVenta.FindAsync(id);
            if (entradaVenta == null)
            {
                return NotFound("No se encontró la entrada venta.");
            }

            context.EntradasVenta.Remove(entradaVenta);
            await context.SaveChangesAsync();

            return Ok($"Se eliminó correctamente la entrada venta con id {id}.");
        }
    }
}
