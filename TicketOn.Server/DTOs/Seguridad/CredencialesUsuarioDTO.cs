using System.ComponentModel.DataAnnotations;

namespace TicketOn.Server.DTO

{
    public class CredencialesUsuarioDTO
    {
        [EmailAddress]
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
