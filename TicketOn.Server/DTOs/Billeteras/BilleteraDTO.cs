namespace TicketOn.Server.DTOs.Billetera
{
    public class BilleteraDTO
    {
        public int Id { get; set; }
        public int EntradaId { get; set; }
        public string NombreEntrada { get; set; }  // Nombre de la tanda o entrada
        public string CodigoQR { get; set; }
        public DateTime FechaAsignacion { get; set; }
        public string UsuarioId { get; set; }
    }
}