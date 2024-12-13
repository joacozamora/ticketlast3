using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.EntradasDTO;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;
using TicketOn.Server.DTOs.Entradas;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/entradas")]
    public class EntradasController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public EntradasController(ApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<EntradaDTO>>> Get()
        {
            var entradas = await context.Entradas
                .ProjectTo<EntradaDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            if (entradas == null || entradas.Count == 0)
            {
                return BadRequest("No hay entradas cargadas.");
            }

            return entradas;
        }

        [HttpGet("entradasConEventos")]
        public async Task<ActionResult<List<EntradaDTO>>> ObtenerEntradasConEventos()
        {
            var entradas = await context.Entradas
                .Include(e => e.Evento) // Incluimos la relación con Evento
                .Select(e => new EntradaDTO
                {
                    Id = e.Id,
                    NombreTanda = e.NombreTanda,
                    Stock = e.Stock,
                    Precio = e.Precio,
                    IdEvento = e.IdEvento,
                    NombreEvento = e.Evento != null ? e.Evento.Nombre : "Evento desconocido"
                })
                .ToListAsync();

            if (entradas == null || entradas.Count == 0)
            {
                return BadRequest("No hay entradas cargadas.");
            }

            return Ok(entradas);
        }


        [HttpGet("porEvento/{eventoId:int}")]
        public async Task<ActionResult<List<EntradaDTO>>> ObtenerEntradasPorEvento(int eventoId)
        {
            var entradas = await context.Entradas
                .Where(e => e.IdEvento == eventoId)
                .ProjectTo<EntradaDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(entradas);
        }

        [HttpGet("{id:int}", Name = "ObtenerEntradaPorId")]
        public async Task<ActionResult<EntradaDTO>> Get(int id)
        {
            var entrada = await context.Entradas
                .ProjectTo<EntradaDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (entrada == null)
            {
                return NotFound();
            }

            return entrada;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] List<EntradaCreacionDTO> entradasCreacionDTO)
        {
            foreach (var entradaCreacionDTO in entradasCreacionDTO)
            {
                // Verificar que el evento existe
                var evento = await context.Eventos
                    .Include(e => e.Usuario) // Incluir la relación con el usuario
                    .FirstOrDefaultAsync(e => e.Id == entradaCreacionDTO.IdEvento);

                if (evento == null)
                {
                    return BadRequest($"El evento con ID {entradaCreacionDTO.IdEvento} no existe.");
                }

                // Obtener el correo del usuario creador del evento
                var correoOrganizador = evento.Usuario?.Email;
                if (string.IsNullOrEmpty(correoOrganizador))
                {
                    return BadRequest($"No se pudo obtener el correo del organizador para el evento ID {entradaCreacionDTO.IdEvento}.");
                }

                // Asignar el correo al DTO
                entradaCreacionDTO.CorreoOrganizador = correoOrganizador;

                // Mapear el DTO a la entidad Entrada
                var entrada = mapper.Map<Entrada>(entradaCreacionDTO);

                // Guardar la entrada en la base de datos
                context.Add(entrada);
            }

            await context.SaveChangesAsync();
            return Ok("Entradas guardadas correctamente");
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, EntradaActualizacionDTO entradaActualizacionDTO)
        {
            // Verificar que la entrada existe
            var entrada = await context.Entradas.FindAsync(id);
            if (entrada == null)
            {
                return NotFound("La entrada no existe.");
            }

            // Actualizar solo los campos permitidos
            entrada.NombreTanda = entradaActualizacionDTO.NombreTanda;
            entrada.Stock = entradaActualizacionDTO.Stock;
            entrada.Precio = entradaActualizacionDTO.Precio;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar entrada: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }



        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entrada = await context.Entradas.FindAsync(id);
            if (entrada == null)
            {
                return NotFound();
            }

            context.Entradas.Remove(entrada);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}

