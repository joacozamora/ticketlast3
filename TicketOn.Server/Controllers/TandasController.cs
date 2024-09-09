using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/tandas")]
    public class TandasController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public TandasController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Tanda>>> Get()
        {

            var lista = await context.Tandas.ToListAsync();


            if (lista == null || lista.Count == 0)
            {
                return BadRequest("No hay Tandas cargadas");
            }

            return lista;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Tanda?>> Get(int id)
        {
            var existe = await context.Tandas.AnyAsync(x => x.Id == id);
            if (!existe)
            {
                return NotFound($"La tanda {id} no existe");
            }
            return await context.Tandas.FirstOrDefaultAsync(ped => ped.Id == id);
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
