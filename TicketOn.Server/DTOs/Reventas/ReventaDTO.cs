namespace TicketOn.Server.DTOs.Reventas
{
    public class ReventaDTO
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public int EntradaVentaId { get; set; }
        public decimal PrecioReventa { get; set; }
        public string UsuarioId { get; set; }
        public string? CompradorId { get; set; }
        public DateTime? FechaReventa { get; set; }  // Permitir nulos aquí
        public string NombreEvento { get; set; }
        public string ImagenEvento { get; set; }
    }

}
