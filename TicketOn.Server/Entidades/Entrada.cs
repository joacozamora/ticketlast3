using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketOn.Server.Entidades
{
    public class Entrada
    {

        public int Id { get; set; }
        public string? NombreTanda { get; set; }

        public int? Stock { get; set; }

        public decimal? Precio { get; set; }

        

        [ForeignKey("Evento")]
        public int IdEvento { get; set; }
        public Evento Evento { get; set; }

        


    }
}
