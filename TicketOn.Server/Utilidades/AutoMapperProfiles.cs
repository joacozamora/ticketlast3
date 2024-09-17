using AutoMapper;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Utilidades
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles() 
        {
            ConfigurarMapeoGeneros();
        }

        private void ConfigurarMapeoGeneros()
        {
            CreateMap<GeneroCreacionDTO, Genero>();
            CreateMap<Genero,GeneroDTO>();
        }
    }
}
