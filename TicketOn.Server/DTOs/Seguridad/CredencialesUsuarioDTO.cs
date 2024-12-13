using System.ComponentModel.DataAnnotations;

namespace TicketOn.Server.DTOs

{
    public class CredencialesUsuarioDTO
    {
        [EmailAddress]
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
        [Required]
        public required string Nombre { get; set; } = null!;

        [Required]
        public required string Apellido { get; set; } = null!;

        [Phone]
        public string? Telefono { get; set; }

        public string? DNI { get; set; }
    }
}
