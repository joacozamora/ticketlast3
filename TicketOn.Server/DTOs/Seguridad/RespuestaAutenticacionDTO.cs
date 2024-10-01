using Microsoft.Identity.Client;

namespace TicketOn.Server.DTO
{
    public class RespuestaAutenticacionDTO
    {
        public required string Token { get; set; }
        public DateTime Expiracion { get; set; }
    }
}
