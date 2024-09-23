namespace TicketOn.Server.Entidades
{
    public class Entrada
    {

        public int Id { get; set; }
        
        public Decimal Precio { get; set; }

        public int Stock {  get; set; }
        public DateTime FechaInicio { get; set; } 
        public DateTime FechaFin { get; set; }    
        public string CodigoQR { get; set; }
    }
}
