namespace TicketOn.Server.DTOs.EntradasVenta
{
    public class EntradaVentaCreacionDTO
    {
        public int EntradaId { get; set; }  
        public int VentaId { get; set; }  
        public string UsuarioId { get; set; }  
        public string? CodigoQR { get; set; }  
        public decimal? PrecioVenta { get; set; }
    }
}
