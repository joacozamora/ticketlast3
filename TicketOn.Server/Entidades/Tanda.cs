namespace TicketOn.Server.Entidades
{
    public class Tanda
    {
        public int Id { get; set; }
        public int Cantidad { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }
}
