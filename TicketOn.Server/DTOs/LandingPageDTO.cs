using TicketOn.Server.DTOs.Eventos;

namespace TicketOn.Server.DTOs
{
    public class LandingPageDTO
    {

        public List<EventoDTO> Publicados { get; set; } = new List<EventoDTO>();
    }
}
