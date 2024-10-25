using TicketOn.Server.DTOs.DetalleVenta;

namespace TicketOn.Server.DTOs.Venta
{
    public class VentaDTO
    {
        public int Id { get; set; }
        public DateTime FechaVenta { get; set; }
        public decimal Total { get; set; }
        public string UsuarioId { get; set; }
        public List<DetalleVentaDTO> DetallesVenta { get; set; }
    }
}
