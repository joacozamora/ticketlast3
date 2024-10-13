namespace TicketOn.Server.DTOs.Eventos
{
    public class EventoCreacionDTO
    {
        public string Nombre { get; set; }
        
        public DateTime FechaInicio { get; set; }

        public IFormFile? Imagen { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        //public string IdUsuario { get; set; }
    }
}
