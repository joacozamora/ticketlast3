using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public UsuariosController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> Get()
        {

            var lista = await context.Usuarios.ToListAsync();


            if (lista == null || lista.Count == 0)
            {
                return BadRequest("No hay usuarios cargados");
            }

            return lista;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Usuario?>> Get(int id)
        {
            var existe = await context.Usuarios.AnyAsync(x => x.Id == id);
            if (!existe)
            {
                return NotFound($"El Usuario {id} no existe");
            }
            return await context.Usuarios.FirstOrDefaultAsync(ped => ped.Id == id);
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
