using System.ComponentModel.DataAnnotations;

namespace TicketOn.Server.DTOs.Seguridad
{
    public class CredencialesLoginDTO
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}