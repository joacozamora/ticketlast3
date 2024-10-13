using Microsoft.AspNetCore.Identity;
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
        public  string Ubicacion { get; set; }
        public string Descripcion { get; set; }

        public ICollection<Entrada> EntradasVenta { get; set; }

        public required string UsuarioId { get; set; }
        public IdentityUser Usuario { get; set; } = null!;
    }
}
