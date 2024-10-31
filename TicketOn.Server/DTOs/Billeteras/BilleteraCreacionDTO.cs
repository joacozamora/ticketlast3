namespace TicketOn.Server.DTOs.Billetera
{
    public class BilleteraCreacionDTO
    {
        public int EntradaId { get; set; }
        public int DetalleVentaId { get; set; }
        public string UsuarioId { get; set; }
        public string CodigoQR { get; set; }
    }
}