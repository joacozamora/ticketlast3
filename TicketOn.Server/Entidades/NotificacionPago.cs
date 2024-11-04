namespace TicketOn.Server.Entidades
{
    public class NotificacionPago
    {
        public string Id { get; set; } // ID de la transacción
        public string Status { get; set; } // Estado del pago
        public string? Date { get; set; } // Fecha del pago
        public string? ExternalReference { get; set; } // ID de referencia externa
        public decimal? Amount { get; set; } // Monto del pago
        public List<Data> Datas { get; set; }

        public class Data
        {
            public string Id { get; set; }
            public string Status { get; set; }
        }
    }
}
