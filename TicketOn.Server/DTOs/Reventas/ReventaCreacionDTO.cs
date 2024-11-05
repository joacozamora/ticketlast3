namespace TicketOn.Server.DTOs.Reventas
{
    public class ReventaCreacionDTO
    {
        public int EntradaVentaId { get; set; }  // ID de la entrada a revender
        public decimal PrecioReventa { get; set; }  // Precio por el que se revende
        public string UsuarioId { get; set; }  // ID del usuario que está revendiendo
        public string AccessToken { get; set; }
    }
}
