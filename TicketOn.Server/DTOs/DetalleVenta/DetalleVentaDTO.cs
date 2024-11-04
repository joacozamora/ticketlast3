namespace TicketOn.Server.DTOs.DetalleVenta
{
    public class DetalleVentaDTO
    {
        public int Id { get; set; }
        public int EntradaId { get; set; }
        public int Cantidad { get; set; }
        public string NombreEntrada { get; set; } // Para mostrar el nombre de la entrada
        public decimal PrecioVenta { get; set; }
    }
}
