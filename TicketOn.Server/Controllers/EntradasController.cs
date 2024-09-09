using Microsoft.AspNetCore.Mvc;

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
    }
}
