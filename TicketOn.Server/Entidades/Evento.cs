using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Sockets;

namespace TicketOn.Server.Entidades
{
    public class Evento
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Imagen { get; set; }

        [Column(TypeName = "decimal(10, 8)")]
        public decimal Latitud { get; set; }

        [Column(TypeName = "decimal(11, 8)")] // Puedes usar decimal(11, 8) para longitud si es necesario.
        public decimal Longitud { get; set; }
        public string Descripcion { get; set; }

        public ICollection<Entrada> EntradasVenta { get; set; }

        public string IdUsuario { get; set; } 
        public IdentityUser User { get; set; }

    }
}
