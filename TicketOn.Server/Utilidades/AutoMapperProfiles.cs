using AutoMapper;
using TicketOn.Server.DTOs.Eventos;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Utilidades
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles() 
        {
            ConfigurarMapeoGeneros();
            ConfigurarMapeoEventos();
        }
        
        private void ConfigurarMapeoEventos()
        {
            CreateMap<EventoCreacionDTO, Evento>();
            CreateMap<Evento,EventoDTO>();
        }
        private void ConfigurarMapeoGeneros()
        {
            CreateMap<GeneroCreacionDTO, Genero>();
            CreateMap<Genero,GeneroDTO>();
        }
    }
}
