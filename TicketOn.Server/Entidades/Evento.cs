using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Sockets;

namespace TicketOn.Server.Entidades
{
    public class Evento
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public bool Activo { get; set; } = true;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Imagen { get; set; }
        [Column(TypeName = "decimal(10, 8)")]
        public decimal Latitud { get; set; }
        [Column(TypeName = "decimal(11, 8)")]
        public decimal Longitud { get; set; }
        public string Descripcion { get; set; }
        public string Direccion { get; set; } // Nuevo
        public string NombreLugar { get; set; } // Nuevo
        public bool EsPublicitado { get; set; } = false;// Nuevo
        public ICollection<Entrada> EntradasVenta { get; set; }
        public required string UsuarioId { get; set; }
        public IdentityUser Usuario { get; set; }
    }

}
