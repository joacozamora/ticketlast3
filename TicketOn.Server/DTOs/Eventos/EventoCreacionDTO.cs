namespace TicketOn.Server.DTOs.Eventos
{
    public class EventoCreacionDTO
    {
        public string Nombre { get; set; }
        //public string Ubicacion { get; set; }
        public DateTime FechaInicio { get; set; }

        public IFormFile? Imagen { get; set; }
        public string UsuarioId { get; set; }

    }
}
