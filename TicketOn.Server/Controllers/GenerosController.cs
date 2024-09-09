using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/generos")]
    public class GenerosController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public GenerosController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Genero>>> Get()
        {

            var lista = await context.Generos.ToListAsync();


            if (lista == null || lista.Count == 0)
            {
                return BadRequest("No hay Generos cargados");
            }

            return lista;
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


        //[HttpPost]
        //public async Task<ActionResult<int>> Post()
        //{

        //}

        //[HttpPut("{id:int}")]
        //public async Task<ActionResult> Put()
        //{

        //}

        //[HttpDelete("{id:int}")]
        //public async Task<ActionResult> Delete()
        //{

        //}
    }
}
