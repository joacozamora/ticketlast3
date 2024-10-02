using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs;
using TicketOn.Server.DTOs.Eventos;
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
        //private readonly IOutputCacheStore outputCacheStore;
        private readonly IAlmacenadorArchivos almacenadorArchivos;
        private const string cacheTag = "eventos";
        private readonly string contenedor = "eventos";

        public EventosController(ApplicationDbContext context, IMapper mapper/*, IOutputCacheStore outputCacheStore*/,IAlmacenadorArchivos almacenadorArchivos)
        {
            this.context = context;
            this.mapper = mapper;
            //this.outputCacheStore = outputCacheStore;
            this.almacenadorArchivos = almacenadorArchivos;
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

        //[HttpGet]
        ////[OutputCache(Tags = [cacheTag])]
        //public async Task<ActionResult<List<Evento>>> Get()
        //{

        //    var lista = await context.Eventos.ToListAsync();


        //    if (lista == null || lista.Count == 0)
        //    {
        //        return BadRequest("No hay Eventos cargados");
        //    }

        //    return lista;
        //}

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

            if (eventoCreacionDTO.Imagen is not null)
            {
                var url = await almacenadorArchivos.Almacenar(contenedor, eventoCreacionDTO.Imagen);
                evento.Imagen = url;
            }

            evento.Descripcion = "esto funciona";
            evento.Ubicacion = "";

            context.Add(evento);
            await context.SaveChangesAsync();

            var eventoDTO = mapper.Map<EventoDTO>(evento);
            //await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return CreatedAtRoute("ObtenerEventoPorId", new { id = evento.Id }, evento);

        }
        //[HttpPost]
        //public async Task<ActionResult<Evento>> Post(EventoDTO eventoDTO)
        //{
        //    if (eventoDTO == null)
        //    {
        //        return BadRequest("Error");
        //    }

        //    var evento = new Evento
        //    {
        //        Nombre = eventoDTO.Nombre,
        //        Imagen = "",
        //        Ubicacion ="",
        //        Descripcion= "esto funciona"


        //        /*Ubicacion = eventoDTO.Ubicacion*/,

        //    };

        //    context.Eventos.Add(evento);
        //    await context.SaveChangesAsync();

        //    return Ok(evento);

        //}

        //}

        //[HttpPut("{id:int}")]
        //public async Task<ActionResult> Put()
        //{

        //}
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

        //[HttpDelete("{id:int}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    return await Delete<Evento>(id);
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
