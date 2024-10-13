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
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "esadmin")]
    public class EventosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        //private readonly IOutputCacheStore outputCacheStore;
        private readonly IAlmacenadorArchivos almacenadorArchivos;
        private readonly IServicioUsuarios servicioUsuarios;
        private const string cacheTag = "eventos";
        private readonly string contenedor = "eventos";

        public EventosController(ApplicationDbContext context, IMapper mapper/*, IOutputCacheStore outputCacheStore*/,IAlmacenadorArchivos almacenadorArchivos,
            IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.mapper = mapper;
            //this.outputCacheStore = outputCacheStore;
            this.almacenadorArchivos = almacenadorArchivos;
            this.servicioUsuarios = servicioUsuarios;
        }

        [HttpGet("landing")]
        [AllowAnonymous]
        public async Task<ActionResult<LandingPageDTO>> Get()
        {

            var publicados = await context.Eventos
                .ProjectTo<EventoDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

  

            var resultado = new LandingPageDTO();
            resultado.Publicados = publicados;
            
            return resultado;
        }


        [HttpGet("{id:int}", Name = "ObtenerEventoPorId")]
        //[OutputCache(Tags = [cacheTag])]
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
            evento.IdUsuario = await servicioUsuarios.ObtenerUsuarioId();
            evento.Descripcion = "esto funciona";
            

            context.Add(evento);
            await context.SaveChangesAsync();

            var eventoDTO = mapper.Map<EventoDTO>(evento);
            //await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return CreatedAtRoute("ObtenerEventoPorId", new { id = evento.Id }, evento);

        }
     
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromForm] EventoCreacionDTO eventoCreacionDTO)
        {
            var evento = await context.Eventos.FirstOrDefaultAsync(a => a.Id == id);

            if (evento is null)
            {
                return NotFound();
            }

            evento = mapper.Map(eventoCreacionDTO, evento);

            if (eventoCreacionDTO.Imagen is not null)
            {
                evento.Imagen = await almacenadorArchivos.Editar(evento.Imagen, contenedor,
                    eventoCreacionDTO.Imagen);
            }

            await context.SaveChangesAsync();
            //await outputCacheStore.EvictByTagAsync(cacheTag, default);

            return NoContent();
        }

      

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
