using Microsoft.AspNetCore.Mvc;

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
    }
}
