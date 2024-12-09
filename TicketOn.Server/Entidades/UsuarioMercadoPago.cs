namespace TicketOn.Server.Entidades
{
    public class UsuarioMercadoPago
    {
        public int Id { get; set; }
        public string UsuarioId { get; set; }  // Relación con el usuario
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime FechaExpiracion { get; set; }
    }
}
