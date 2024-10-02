using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.EntradasDTO;
using TicketOn.Server.Entidades;

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
        public async Task<IActionResult> Post([FromBody] EntradaCreacionDTO entradaCreacionDTO)
        {
            var eventoExiste = await context.Eventos.AnyAsync(e => e.Id == entradaCreacionDTO.IdEvento);
            if (!eventoExiste)
            {
                return BadRequest("El evento especificado no existe");
            }

            var entrada = mapper.Map<Entrada>(entradaCreacionDTO);
            context.Add(entrada);
            await context.SaveChangesAsync();
            return CreatedAtRoute("ObtenerEntradaPorId", new { id = entrada.Id }, entrada);
            //var entrada = mapper.Map<Entrada>(entradaCreacionDTO);
            //context.Add(entrada);
            //await context.SaveChangesAsync();
            //return CreatedAtRoute("ObtenerEntradaPorId", new { id = entrada.Id }, entrada);
        }

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
