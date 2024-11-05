namespace TicketOn.Server.DTOs.Reventas
{
    public class ReventaDTO
    {
        public int Id { get; set; }  // ID de la reventa
        public int EntradaVentaId { get; set; }  // ID de la entrada que se revende
        public decimal PrecioReventa { get; set; }  // Precio de reventa
        public string UsuarioId { get; set; }  // ID del usuario que realizó la reventa
        public DateTime FechaReventa { get; set; }  // Fecha en que se realizó la reventa
    }
}
