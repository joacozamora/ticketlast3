using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketOn.Server.Entidades
{
    public class Reventa
    {
        public int Id { get; set; }  // ID de la reventa
        public string Estado {  get; set; } = "Disponible";
        public int EntradaVentaId { get; set; }  // ID de la entrada venta
        public EntradaVenta EntradaVenta { get; set; }

        public string UsuarioId { get; set; }  // ID del usuario que está revendiendo
        public IdentityUser Usuario { get; set; }  // Relación con el usuario
        public string? CompradorId { get; set; }
        public IdentityUser Comprador { get; set; }

        public decimal PrecioReventa { get; set; }  // Precio de reventa
        public DateTime FechaPublicacion { get; set; } = DateTime.UtcNow;  // Fecha de publicación de la reventa
        public DateTime? FechaReventa { get; set; }
    }
}
