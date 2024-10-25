using Microsoft.AspNetCore.Identity;

namespace TicketOn.Server.Entidades
{
    public class Venta
    {
        public int Id { get; set; }
        public DateTime FechaVenta { get; set; }
        public decimal Total { get; set; }

        // Relación con Usuario (el comprador)
        public required string UsuarioId { get; set; }
        public IdentityUser Usuario { get; set; } = null!;

        // Relación con DetalleVenta
        public ICollection<DetalleVenta> DetallesVenta { get; set; }
    }
}
