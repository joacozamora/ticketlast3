namespace TicketOn.Server.DTOs.Usuario
{
    public class UsuarioActualizacionDTO
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string? Telefono { get; set; }
        public string? DNI { get; set; }
        public string Email { get; set; }
    }
}
