using Microsoft.AspNetCore.Identity;

namespace TicketOn.Server.Entidades
{
    public class UsuarioDetalle
    {
        public string Id { get; set; } // Relación con IdentityUser.Id
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Telefono { get; set; }
        public string? DNI { get; set; }

        public IdentityUser IdentityUser { get; set; } // Relación con IdentityUser
    }
}
