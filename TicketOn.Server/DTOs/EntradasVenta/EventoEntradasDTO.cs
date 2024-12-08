namespace TicketOn.Server.DTOs.EntradasVenta
{
    public class EventoEntradasDTO
    {
        public int EventoId { get; set; } // ID del evento
        public string NombreEvento { get; set; } // Nombre del evento
        public string ImagenEvento { get; set; } // URL de la imagen del evento

        public List<EntradaVentaDTO> Entradas { get; set; } // Lista de entradas asociadas
    }

}
