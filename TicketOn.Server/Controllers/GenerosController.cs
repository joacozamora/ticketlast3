using Microsoft.AspNetCore.Mvc;

namespace TicketOn.Server.Controllers
{
    public class GenerosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
