using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.EntradasDTO;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/entradas")]
    public class EntradasController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IServicioUsuarios servicioUsuarios;
        private readonly IMapper mapper;

        public EntradasController(ApplicationDbContext context, IMapper mapper, IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.mapper = mapper;
            this.servicioUsuarios = servicioUsuarios;
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
                var eventoExiste = await context.Eventos.AnyAsync(e => e.Id == entradaCreacionDTO.IdEvento);
                if (!eventoExiste)
                {
                    return BadRequest("El evento especificado no existe para alguna de las entradas");
                }

                // Mapear el DTO a la entidad Entrada
                var entrada = mapper.Map<Entrada>(entradaCreacionDTO);

                // Obtener el Id del usuario actual
                var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

                // Asignar el UsuarioActualId al de la entrada basado en el creador del evento
                entrada.UsuarioActualId = usuarioId;

                // Guardar la entrada en la base de datos
                context.Add(entrada);
            }

            await context.SaveChangesAsync();
            return Ok("Entradas guardadas correctamente");
        }

        //[HttpPost]
        //public async Task<IActionResult> Post([FromBody] EntradaCreacionDTO entradaCreacionDTO)
        //{
        //    // Verificar que el evento existe
        //    var eventoExiste = await context.Eventos.AnyAsync(e => e.Id == entradaCreacionDTO.IdEvento);
        //    if (!eventoExiste)
        //    {
        //        return BadRequest("El evento especificado no existe");
        //    }

        //    // Mapear el DTO a la entidad Entrada
        //    var entrada = mapper.Map<Entrada>(entradaCreacionDTO);

        //    // Obtener el Id del usuario actual
        //    var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

        //    // Asignar el UsuarioActualId al de la entrada basado en el creador del evento
        //    entrada.UsuarioActualId = usuarioId;

        //    // Guardar la entrada en la base de datos
        //    context.Add(entrada);
        //    await context.SaveChangesAsync();

        //    // Mapear la entidad entrada a DTO si es necesario
        //    var entradaDTO = mapper.Map<EntradaDTO>(entrada);

        //    // Retornar la respuesta con la ruta del nuevo recurso
        //    return CreatedAtRoute("ObtenerEntradaPorId", new { id = entrada.Id }, entradaDTO);
        //}



        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] EntradaDTO entradaDTO)
        {
            var entradaExiste = await context.Entradas.AnyAsync(e => e.Id == id);

            if (!entradaExiste)
            {
                return NotFound();
            }

            var entrada = mapper.Map<Entrada>(entradaDTO);
            entrada.Id = id;

            context.Entradas.Update(entrada);
            await context.SaveChangesAsync();

            return NoContent();
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

            return Ok($"Se eliminó correctamente la entrada con id {id}.");
        }
    }
}
