namespace TicketOn.Server.DTOs.Eventos
{
    public class EventoDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaInicio { get; set; }
        public string Imagen { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public string Direccion { get; set; } // Nuevo
        public string NombreLugar { get; set; } // Nuevo
        public bool EsPublicitado { get; set; } // Nuevo
        public string IdUsuario { get; set; }

        public bool Activo { get; set; }
    }

}
