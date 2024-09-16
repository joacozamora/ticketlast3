using System.ComponentModel.DataAnnotations;
using TicketOn.Server.Validaciones;

namespace TicketOn.Server.DTOs.Generos
{
    public class GeneroDTO
    {
        public int Id { get; set; }
      
        public string Nombre { get; set; }
    }
}
