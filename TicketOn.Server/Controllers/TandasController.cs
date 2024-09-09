using Microsoft.AspNetCore.Mvc;

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
    }
}
