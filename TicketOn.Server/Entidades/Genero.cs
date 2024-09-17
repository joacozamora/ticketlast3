using System.ComponentModel.DataAnnotations;
using TicketOn.Server.Validaciones;

namespace TicketOn.Server.Entidades
{
    public class Genero
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "El campo {0} debe tener {1} caracteres o menos")]
        [PrimeraLetraMayus]
        public string Nombre { get; set; }
    }
}
