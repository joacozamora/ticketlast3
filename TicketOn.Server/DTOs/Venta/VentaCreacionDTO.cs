using TicketOn.Server.DTOs.DetalleVenta;

namespace TicketOn.Server.DTOs.Venta
{
    public class VentaCreacionDTO
    {
        public DateTime FechaVenta { get; set; } = DateTime.UtcNow;
        public decimal Total { get; set; }

        public List<DetalleVentaCreacionDTO> DetallesVenta { get; set; } = new List<DetalleVentaCreacionDTO>();

    }
}
