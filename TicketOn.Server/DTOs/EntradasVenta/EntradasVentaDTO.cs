namespace TicketOn.Server.DTOs.EntradasVenta
{
    public class EntradaVentaDTO
    {
        public int Id { get; set; }  
        public int EntradaId { get; set; } 
        public int VentaId { get; set; }  
        public string UsuarioId { get; set; }  
        public string? CodigoQR { get; set; }  
        public DateTime FechaAsignacion { get; set; }  
        public decimal? PrecioVenta { get; set; }
        public string NombreEntrada { get; set; } 
        public string ImagenEvento { get; set; } 
        public string Correo { get; set; } 
        public string NombreEvento { get; set; }
        public bool EnReventa { get; set; }
    }
}
