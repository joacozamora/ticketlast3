namespace TicketOn.Server.DTOs.EntradasDTO
{
    public class EntradaDTO
    {
        public int Id { get; set; }
        public string? NombreTanda { get; set; }
        public int? Stock { get; set; }
        public decimal? Precio { get; set; }
        public int IdEvento { get; set; }
        
    }
}
