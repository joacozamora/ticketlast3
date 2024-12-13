namespace TicketOn.Server.DTOs.Usuario
{
    public class UsuarioDTO
    {
        public required string Email { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Telefono { get; set; }
        public string? DNI { get; set; }
    }
}
