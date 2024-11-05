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
            CreateMap<VentaCreacionDTO, Venta>();
                 // Ignorar DetallesVenta en creación

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
            CreateMap<Reventa, ReventaDTO>(); // Mapeo de Reventa a ReventaDTO
            CreateMap<ReventaCreacionDTO, Reventa>(); // Mapeo para crear Reventa
        }

    }
}
