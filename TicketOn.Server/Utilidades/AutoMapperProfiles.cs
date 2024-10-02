using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TicketOn.Server.DTOs.EntradasDTO;
using TicketOn.Server.DTOs.Eventos;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.DTOs.Usuario;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Utilidades
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles() 
        {
            ConfigurarMapeoGeneros();
            ConfigurarMapeoEventos();
            ConfigurarMapeoUsuarios();
            ConfigurarMapeoEntradas();
        }

        private void ConfigurarMapeoEntradas()
        {
            CreateMap<Entrada, EntradaDTO>().ReverseMap();
            CreateMap<EntradaCreacionDTO, Entrada>()
                .ForMember(dest => dest.IdEvento, opt => opt.MapFrom(src => src.IdEvento));
        }

        private void ConfigurarMapeoUsuarios() 
        {
            CreateMap<IdentityUser, UsuarioDTO>();
        
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
