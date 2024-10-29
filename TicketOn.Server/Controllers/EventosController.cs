using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs;
using TicketOn.Server.DTOs.Eventos;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/eventos")]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "esadmin")]
    public class EventosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        
        private readonly IAlmacenadorArchivos almacenadorArchivos;
        private readonly IServicioUsuarios servicioUsuarios;
        private const string cacheTag = "eventos";
        private readonly string contenedor = "eventos";

        public EventosController(ApplicationDbContext context, IMapper mapper,IAlmacenadorArchivos almacenadorArchivos,
            IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.mapper = mapper;
            
            this.almacenadorArchivos = almacenadorArchivos;
            this.servicioUsuarios = servicioUsuarios;
        }
        [HttpGet("landing")]
        [AllowAnonymous]
        public async Task<ActionResult<LandingPageDTO>> Get()
        {
            var publicados = await context.Eventos
                .ProjectTo<EventoDTO>(mapper.ConfigurationProvider) // Mapeamos usando AutoMapper
                .ToListAsync();

            var resultado = new LandingPageDTO
            {
                Publicados = publicados
            };

            return resultado;
        }


        [HttpGet("eventosPage")]
        public async Task<ActionResult<EventoPageDTO>> Get([FromQuery] string email) // Usamos [FromQuery] para que sepa que el parámetro viene de la query string
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("El correo electrónico es requerido.");
            }

            // Buscar el usuario con el correo electrónico proporcionado
            var usuario = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (usuario == null)
            {
                return BadRequest("No se encontró un usuario con ese correo electrónico.");
            }

            // Filtrar los eventos por el ID del usuario
            var creados = await context.Eventos
                .Where(e => e.UsuarioId == usuario.Id)
                .ProjectTo<EventoDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            var resultado = new EventoPageDTO
            {
                Creados = creados
            };

            return resultado;
        }



        //[HttpGet("eventosPage")]
        //[AllowAnonymous]
        //public async Task<ActionResult<EventoPageDTO>> Get(string id)
        //{
        //    //var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

        //    if (string.IsNullOrEmpty(id))
        //    {
        //        return BadRequest("ID de usuario no proporcionado.");
        //    }
        //    var creados = await context.Eventos
        //.Where(e => e.UsuarioId == id) // Filtrar por el ID del usuario
        //.ProjectTo<EventoDTO>(mapper.ConfigurationProvider) // Mapeamos usando AutoMapper
        //.ToListAsync();
        //    var resultado = new EventoPageDTO
        //    {
        //        Creados = creados
        //    };

        //    return resultado;
        //}

        //[HttpGet("landing")]
        //[AllowAnonymous]
        //public async Task<ActionResult<LandingPageDTO>> Get()
        //{

        //    var publicados = await context.Eventos
        //        .ProjectTo<EventoDTO>(mapper.ConfigurationProvider)
        //        .ToListAsync();



        //    var resultado = new LandingPageDTO();
        //    resultado.Publicados = publicados;

        //    return resultado;
        //}


        [HttpGet("{id:int}", Name = "ObtenerEventoPorId")]
        [AllowAnonymous]
        
        public async Task<ActionResult<EventoDTO>> Get(int id)
        {
            var evento = await context.Eventos
                 .ProjectTo<EventoDTO>(mapper.ConfigurationProvider)
                 .FirstOrDefaultAsync(g => g.Id == id);

            if (evento == null)
            {
                return NotFound();
            }

            return evento;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] EventoCreacionDTO eventoCreacionDTO)
        {
            var evento = mapper.Map<Evento>(eventoCreacionDTO);
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            if (eventoCreacionDTO.Imagen is not null)
            {
                var url = await almacenadorArchivos.Almacenar(contenedor, eventoCreacionDTO.Imagen);
                evento.Imagen = url;
            }


            evento.UsuarioId = usuarioId;
            evento.Descripcion = "esto funciona";


            context.Add(evento);
            await context.SaveChangesAsync();

            var eventoDTO = mapper.Map<EventoDTO>(evento);
            
            return CreatedAtRoute("ObtenerEventoPorId", new { id = evento.Id }, evento);

        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromForm] EventoCreacionDTO eventoCreacionDTO)
        {
            // Verifica si el evento existe
            var evento = await context.Eventos.FirstOrDefaultAsync(a => a.Id == id);

            if (evento is null)
            {
                return NotFound();
            }

            try
            {
                // Mapea los datos de eventoCreacionDTO a evento existente
                evento = mapper.Map(eventoCreacionDTO, evento);

                // Manejo de la imagen, si hay una imagen en el DTO
                if (eventoCreacionDTO.Imagen is not null)
                {
                    evento.Imagen = await almacenadorArchivos.Editar(evento.Imagen, contenedor, eventoCreacionDTO.Imagen);
                }

                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log del error para diagnóstico
                Console.WriteLine($"Error al editar evento: {ex.Message}");
                return StatusCode(500, "Hubo un error en el servidor al editar el evento.");
            }
        }

        //[HttpPut("{id:int}")]
        //public async Task<IActionResult> Put(int id, [FromForm] EventoCreacionDTO eventoCreacionDTO)
        //{
        //    var evento = await context.Eventos.FirstOrDefaultAsync(a => a.Id == id);

        //    if (evento is null)
        //    {
        //        return NotFound();
        //    }

        //    evento = mapper.Map(eventoCreacionDTO, evento);

        //    if (eventoCreacionDTO.Imagen is not null)
        //    {
        //        evento.Imagen = await almacenadorArchivos.Editar(evento.Imagen, contenedor,
        //            eventoCreacionDTO.Imagen);
        //    }

        //    await context.SaveChangesAsync();


        //    return NoContent();
        //}



        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var evento = await context.Eventos.FindAsync(id);
            if (evento == null)
            {
                return NotFound();
            }

            context.Eventos.Remove(evento);
            await context.SaveChangesAsync();

            return Ok($"Se elimino correctamente el evento de id {id}");
        }
    }
}
