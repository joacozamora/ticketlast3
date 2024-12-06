namespace TicketOn.Server.Entidades
{
    public class DetalleVenta
    {
        public int Id { get; set; }
        public int VentaId { get; set; }
        public int Cantidad { get; set; }
        public Venta Venta { get; set; }

        // Relación con Entrada
        public int EntradaId { get; set; }
        public Entrada Entrada { get; set; }

        public decimal PrecioVenta { get; set; }

        
    }
}