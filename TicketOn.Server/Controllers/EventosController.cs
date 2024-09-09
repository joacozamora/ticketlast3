using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/eventos")]
    public class EventosController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public EventosController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Evento>>> Get()
        {

            var lista = await context.Eventos.ToListAsync();


            if (lista == null || lista.Count == 0)
            {
                return BadRequest("No hay Eventos cargados");
            }

            return lista;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Evento?>> Get(int id)
        {
            var existe = await context.Eventos.AnyAsync(x => x.Id == id);
            if (!existe)
            {
                return NotFound($"El evento {id} no existe");
            }
            return await context.Eventos.FirstOrDefaultAsync(ped => ped.Id == id);
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
