using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketOn.Server.Entidades
{
    public class EntradaVenta
    {
        public int Id { get; set; }  // ID de la entrada vendida
        public int EntradaId { get; set; }  // ID de la entrada original
        public Entrada Entrada { get; set; }  // Relación con la entrada

        public int VentaId { get; set; }  // ID de la venta a la que pertenece esta entrada
        public Venta Venta { get; set; }  // Relación con la venta

        public string UsuarioId { get; set; }  // ID del usuario que compró la entrada
        public IdentityUser Usuario { get; set; }  // Relación con el usuario

        public string? CodigoQR { get; set; }  // Código QR asociado a la venta
        public DateTime FechaAsignacion { get; set; } = DateTime.UtcNow;  // Fecha en que se realizó la venta
        public decimal? PrecioVenta { get; set; }
    
    }
}
