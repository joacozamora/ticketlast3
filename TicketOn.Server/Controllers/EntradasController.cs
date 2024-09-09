using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/entradas")]
    public class EntradasController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public EntradasController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Entrada>>> Get()
        {           

            var lista = await context.Entradas.ToListAsync();
            

            if (lista == null || lista.Count == 0)
            {
                return BadRequest("No hay entradas cargados");
            }

            return lista;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Entrada?>> Get(int id)
        {
            var existe = await context.Entradas.AnyAsync(x => x.Id == id);
            if (!existe)
            {
                return NotFound($"La entrada {id} no existe");
            }
            return await context.Entradas.FirstOrDefaultAsync(ped => ped.Id == id);
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
