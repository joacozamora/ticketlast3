using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TicketOn.Server.DTOs.EntradasDTO;
using TicketOn.Server.DTOs.Eventos;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.DTOs.Usuario;
using TicketOn.Server.DTOs.Venta;
using TicketOn.Server.DTOs.DetalleVenta;
using TicketOn.Server.Entidades;
using TicketOn.Server.DTOs.EntradasVenta;
using TicketOn.Server.DTOs.Reventas;
using TicketOn.Server.DTOs.Entradas;

namespace TicketOn.Server.Utilidades
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            ConfigurarMapeoGeneros();
            ConfigurarMapeoEventos();
            ConfigurarMapeoUsuarios();
            ConfigurarMapeoEntradas();
            ConfigurarMapeoVentas();
            ConfigurarMapeoEntradaVenta();
            ConfigurarMapeoReventa();

        }

        private void ConfigurarMapeoEntradas()
        {
            // Mapear de Entrada a EntradaDTO, incluyendo NombreEvento
            CreateMap<Entrada, EntradaDTO>()
                .ForMember(dest => dest.NombreEvento, opt => opt.MapFrom(src => src.Evento.Nombre))
                .ReverseMap()
                .ForMember(dest => dest.Evento, opt => opt.Ignore()) // Ignorar la relación Evento al mapear de DTO a entidad
                .ForMember(dest => dest.IdEvento, opt => opt.MapFrom(src => src.IdEvento))
                .ForMember(dest => dest.Id, opt => opt.Ignore()); // Ignorar el ID al mapear de DTO a entidad para creación o edición

            // Mapear de EntradaCreacionDTO a Entrada
            CreateMap<EntradaCreacionDTO, Entrada>()
                .ForMember(dest => dest.IdEvento, opt => opt.MapFrom(src => src.IdEvento))
                .ForMember(dest => dest.Evento, opt => opt.Ignore()) // Ignorar la relación Evento
                .ForMember(dest => dest.Id, opt => opt.Ignore()); // Ignorar el ID para creación

        }


        private void ConfigurarMapeoUsuarios()
        {
            CreateMap<IdentityUser, UsuarioDTO>();
        }

        private void ConfigurarMapeoEventos()
        {
            CreateMap<EventoCreacionDTO, Evento>();
            CreateMap<Evento, EventoDTO>();
        }

        private void ConfigurarMapeoGeneros()
        {
            CreateMap<GeneroCreacionDTO, Genero>();
            CreateMap<Genero, GeneroDTO>();
        }

        private void ConfigurarMapeoVentas()
        {
            // Mapeo de Venta y DetalleVenta
            CreateMap<Venta, VentaDTO>()
                .ForMember(dest => dest.DetallesVenta, opt => opt.MapFrom(src => src.DetallesVenta));
            CreateMap<VentaCreacionDTO, Venta>()
                .ForMember(dest => dest.DetallesVenta, opt => opt.Ignore()); // Ignorar DetallesVenta en la creación

            CreateMap<DetalleVenta, DetalleVentaDTO>()
                .ForMember(dest => dest.NombreEntrada, opt => opt.MapFrom(src => src.Entrada.NombreTanda));
            CreateMap<DetalleVentaCreacionDTO, DetalleVenta>();
        }

        private void ConfigurarMapeoEntradaVenta() // Nuevo método para EntradaVenta
        {
            CreateMap<EntradaVenta, EntradaVentaDTO>(); // Mapeo de EntradaVenta a EntradaVentaDTO
            CreateMap<EntradaVentaCreacionDTO, EntradaVenta>(); // Mapeo para crear EntradaVenta
            


        }

        private void ConfigurarMapeoReventa() // Nuevo método para Reventa
        {
            CreateMap<ReventaCreacionDTO, Reventa>()
    .ForMember(dest => dest.EntradaVentaId, opt => opt.MapFrom(src => src.EntradaVentaId));
            CreateMap<Reventa, ReventaDTO>();
        }

    }
}
