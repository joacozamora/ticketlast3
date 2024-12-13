using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;

namespace TicketOn.Server.DTOs
{
    public class RespuestaAutenticacionDTO
    {
        public required string Token { get; set; }
        public DateTime Expiracion { get; set; }

        
        
    }
}
