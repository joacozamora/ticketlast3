using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TicketOn.Server.DTOs.EntradasDTO;
using TicketOn.Server.DTOs.Eventos;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.DTOs.Usuario;
using TicketOn.Server.DTOs.Venta;
using TicketOn.Server.DTOs.Billetera;
using TicketOn.Server.DTOs.DetalleVenta;
using TicketOn.Server.Entidades;

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
            ConfigurarMapeoBilletera();
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

        private void ConfigurarMapeoBilletera()
        {
            // Mapeo de Billetera
            CreateMap<Billetera, BilleteraDTO>()
                .ForMember(dest => dest.NombreEntrada, opt => opt.MapFrom(src => src.Entrada.NombreTanda))
                .ForMember(dest => dest.FechaAsignacion, opt => opt.MapFrom(src => src.FechaAsignacion));
            CreateMap<BilleteraCreacionDTO, Billetera>();
        }
    }
}
