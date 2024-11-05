namespace TicketOn.Server.DTOs.EntradasVenta
{
    public class EntradaVentaDTO
    {
        public int Id { get; set; }  // ID de la entrada vendida
        public int EntradaId { get; set; }  // ID de la entrada original
        public int VentaId { get; set; }  // ID de la venta a la que pertenece esta entrada
        public string UsuarioId { get; set; }  // ID del usuario que compró la entrada
        public string? CodigoQR { get; set; }  // Código QR asociado a la venta
        public DateTime FechaAsignacion { get; set; }  // Fecha en que se realizó la venta
        public decimal? PrecioVenta { get; set; }
        public string NombreEntrada { get; set; } // Nombre de la entrada
        public string ImagenEvento { get; set; } // URL de la imagen del evento
        public string Correo { get; set; } // Correo del organizador
        public string NombreEvento { get; set; }
    }
}
