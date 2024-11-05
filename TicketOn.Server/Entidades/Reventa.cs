using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketOn.Server.Entidades
{
    public class Reventa
    {
        public int Id { get; set; }  // ID de la reventa
        public int EntradaId { get; set; }  // ID de la entrada que se está revendiendo
        public Entrada Entrada { get; set; }  // Relación con la entrada

        public string UsuarioId { get; set; }  // ID del usuario que está revendiendo
        public IdentityUser Usuario { get; set; }  // Relación con el usuario

        public decimal PrecioReventa { get; set; }  // Precio de reventa
        public DateTime FechaPublicacion { get; set; } = DateTime.UtcNow;  // Fecha de publicación de la reventa
    }
}
