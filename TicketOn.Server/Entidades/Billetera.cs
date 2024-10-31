using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketOn.Server.Entidades
{
    public class Billetera
    {
        public int Id { get; set; }

        // Relación con Entrada y DetalleVenta (referencia a la entrada comprada)
        public int EntradaId { get; set; }
        public Entrada Entrada { get; set; }

        public int DetalleVentaId { get; set; }
        public DetalleVenta DetalleVenta { get; set; }

        // Usuario que posee la entrada
        public required string UsuarioId { get; set; }
        public IdentityUser Usuario { get; set; }

        // Código QR cifrado de la entrada
        public string CodigoQR { get; set; }

        public DateTime FechaAsignacion { get; set; } = DateTime.UtcNow;
    }
}