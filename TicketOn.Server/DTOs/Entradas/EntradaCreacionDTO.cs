namespace TicketOn.Server.DTOs.EntradasDTO
{
    public class EntradaCreacionDTO
    {
        public string? NombreTanda { get; set; }
        public int? Stock { get; set; }
        public decimal? Precio { get; set; }
        public int IdEvento { get; set; }
        public string CorreoOrganizador { get; set; }

        
    }
}
