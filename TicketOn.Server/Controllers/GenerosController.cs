using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.Eventos;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/generos")]
    public class GenerosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public GenerosController(ApplicationDbContext context,IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<GeneroDTO>>> Get()
        {

            var generos  = await context.Generos.ProjectTo<GeneroDTO>(mapper.ConfigurationProvider).ToListAsync();


            if (generos == null || generos.Count == 0)
            {
                return BadRequest("No hay Generos cargados");
            }

            return generos;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Genero?>> Get(int id)
        {
            var existe = await context.Generos.AnyAsync(x => x.Id == id);
            if (!existe)
            {
                return NotFound($"El genero {id} no existe");
            }
            return await context.Generos.FirstOrDefaultAsync(ped => ped.Id == id);
        }


        [HttpPost]
        public async Task<ActionResult<Genero>> Post(GeneroCreacionDTO generoCreacionDTO)
        {
            if (generoCreacionDTO == null)
            {
                return BadRequest("Error");
            }

            var genero = mapper.Map<Genero>(generoCreacionDTO);

            context.Generos.Add(genero);
            await context.SaveChangesAsync();

            return Ok(genero);
        }
        //[HttpPut("{id:int}")]
        //public async Task<ActionResult> Put()
        //{

        //}

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var genero = await context.Generos.FindAsync(id);
            if (genero == null)
            {
                return NotFound();
            }

            context.Generos.Remove(genero);
            await context.SaveChangesAsync();

            return Ok($"Se elimino correctamente el genero de id {id}");
        }
    }
}
