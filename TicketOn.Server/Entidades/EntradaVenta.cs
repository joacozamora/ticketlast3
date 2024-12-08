using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketOn.Server.Entidades
{
    public class EntradaVenta
    {
        public int Id { get; set; }  
        public int EntradaId { get; set; }  
        public Entrada Entrada { get; set; }  
        public int VentaId { get; set; }  
        public Venta Venta { get; set; } 
        public string UsuarioId { get; set; } 
        public IdentityUser Usuario { get; set; }  
        public string? CodigoQR { get; set; }  
        public DateTime FechaAsignacion { get; set; } = DateTime.UtcNow;  
        public decimal? PrecioVenta { get; set; }
        public bool EnReventa { get; set; } = false;

    
    }
}
