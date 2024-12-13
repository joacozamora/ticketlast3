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
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
                .Where(e => e.Activo) // Filtrar solo los activos
                .ProjectTo<EventoDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            return new LandingPageDTO { Publicados = publicados };
        }

        [HttpGet("nombre/{idEvento:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> ObtenerNombreEvento(int idEvento)
        {
            var evento = await context.Eventos.FindAsync(idEvento);

            if (evento == null)
            {
                return NotFound("Evento no encontrado.");
            }

            return Ok(evento.Nombre);
        }

        [HttpGet("todos")]
        [AllowAnonymous]
        public async Task<ActionResult<List<EventoDTO>>> GetTodos()
        {
            var todosLosEventos = await context.Eventos
                .ProjectTo<EventoDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            if (todosLosEventos == null || todosLosEventos.Count == 0)
            {
                return NotFound("No hay eventos disponibles.");
            }

            return Ok(todosLosEventos);
        }

        //eventospage claim
        [HttpGet("eventosPage")]
        [Authorize]
        public async Task<ActionResult<EventoPageDTO>> GetEventosPage()
        {
            // Obtener el ID del usuario autenticado
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            if (string.IsNullOrWhiteSpace(usuarioId))
            {
                return Unauthorized("No se pudo obtener la información del usuario.");
            }

            // Filtrar eventos creados por este usuario
            var creados = await context.Eventos
                .Where(e => e.UsuarioId == usuarioId)
                .ProjectTo<EventoDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            // Devolver la lista aunque esté vacía
            return Ok(new EventoPageDTO { Creados = creados });
        }







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
        [Authorize(Policy = "esproductora")]
        public async Task<IActionResult> Post([FromForm] EventoCreacionDTO eventoCreacionDTO)
        {
            var culture = System.Globalization.CultureInfo.InvariantCulture;

            // Verificar que el usuario tiene el claim de "esproductora"
            var esProductora = User.HasClaim(c => c.Type == "esproductora" && c.Value == "true");
            if (!esProductora)
            {
                return Forbid("No tienes permisos para crear eventos.");
            }

            // Mapeo inicial de DTO a entidad
            var evento = mapper.Map<Evento>(eventoCreacionDTO);

            // Obtener el usuario logueado
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
            if (string.IsNullOrWhiteSpace(evento.Descripcion))
            {
                evento.Descripcion = "Descripción predeterminada"; // Cambia esto según sea necesario
            }
            // Manejo de la imagen (subida a Cloudinary)
            if (eventoCreacionDTO.Imagen is not null)
            {
                var url = await almacenadorArchivos.Almacenar(contenedor, eventoCreacionDTO.Imagen);
                evento.Imagen = url;
            }
            if (eventoCreacionDTO.Imagen == null && string.IsNullOrWhiteSpace(evento.Imagen))
            {
                return BadRequest("No se especificó una imagen.");
            }
            // Asignación del ID del usuario
            evento.UsuarioId = usuarioId;

            // Asegurar formato correcto para Latitud y Longitud
            evento.Latitud = decimal.Parse(eventoCreacionDTO.Latitud.ToString(culture), culture);
            evento.Longitud = decimal.Parse(eventoCreacionDTO.Longitud.ToString(culture), culture);

            // Validar y asignar valores para los nuevos campos
            evento.Direccion = eventoCreacionDTO.Direccion ?? "Dirección no especificada";
            evento.NombreLugar = eventoCreacionDTO.NombreLugar ?? "Lugar no especificado";
            evento.EsPublicitado = false;
            evento.Activo = true;

            // Log para verificar los valores
            Console.WriteLine($"Latitud: {evento.Latitud}, Longitud: {evento.Longitud}, Dirección: {evento.Direccion}, NombreLugar: {evento.NombreLugar}, EsPublicitado: {evento.EsPublicitado}");

            // Agregar el evento a la base de datos
            context.Add(evento);
            await context.SaveChangesAsync();

            // Mapeo de la entidad creada a DTO
            var eventoDTO = mapper.Map<EventoDTO>(evento);

            // Respuesta con CreatedAtRoute
            return CreatedAtRoute("ObtenerEventoPorId", new { id = evento.Id }, eventoDTO);
        }
        //post claim
        //[HttpPost]
        //[Authorize(Policy = "esproductora")]
        //public async Task<IActionResult> Post([FromForm] EventoCreacionDTO eventoCreacionDTO)
        //{
        //    var culture = System.Globalization.CultureInfo.InvariantCulture;

        //    // Verificar que el usuario tiene el claim de "esproductora"
        //    var esProductora = User.HasClaim(c => c.Type == "esproductora" && c.Value == "true");
        //    if (!esProductora)
        //    {
        //        return Forbid("No tienes permisos para crear eventos.");
        //    }

        //    // Mapeo inicial de DTO a entidad
        //    var evento = mapper.Map<Evento>(eventoCreacionDTO);

        //    // Obtener el usuario logueado
        //    var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

        //    // Manejo de la imagen (subida a Cloudinary)
        //    if (eventoCreacionDTO.Imagen is not null)
        //    {
        //        var url = await almacenadorArchivos.Almacenar(contenedor, eventoCreacionDTO.Imagen);
        //        evento.Imagen = url;
        //    }

        //    // Asignación del ID del usuario
        //    evento.UsuarioId = usuarioId;

        //    // Asegurar formato correcto para Latitud y Longitud
        //    evento.Latitud = decimal.Parse(eventoCreacionDTO.Latitud.ToString(culture), culture);
        //    evento.Longitud = decimal.Parse(eventoCreacionDTO.Longitud.ToString(culture), culture);

        //    // Asignar valor predeterminado a Descripcion si está vacío
        //    evento.Descripcion ??= "Descripción predeterminada"; // Cambia este texto según corresponda

        //    // Log para verificar los valores
        //    Console.WriteLine($"Latitud: {evento.Latitud}, Longitud: {evento.Longitud}, Descripcion: {evento.Descripcion}");

        //    // Agregar el evento a la base de datos
        //    context.Add(evento);
        //    await context.SaveChangesAsync();

        //    // Mapeo de la entidad creada a DTO
        //    var eventoDTO = mapper.Map<EventoDTO>(evento);

        //    // Respuesta con CreatedAtRoute
        //    return CreatedAtRoute("ObtenerEventoPorId", new { id = evento.Id }, eventoDTO);
        //}


        [HttpPut("{id:int}")]
        [Authorize(Policy = "esproductora")]
        public async Task<IActionResult> Put(int id, [FromForm] EventoCreacionDTO eventoCreacionDTO)
        {
            var eventoDB = await context.Eventos.FirstOrDefaultAsync(e => e.Id == id);

            if (eventoDB == null)
            {
                return NotFound($"El evento con el ID {id} no existe.");
            }

            // Validar que el usuario actual es el creador del evento
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
            if (eventoDB.UsuarioId != usuarioId)
            {
                return Forbid("No tienes permisos para editar este evento.");
            }

            // Actualizar propiedades del evento
            eventoDB.Nombre = eventoCreacionDTO.Nombre;
            eventoDB.Direccion = eventoCreacionDTO.Direccion;
            eventoDB.NombreLugar = eventoCreacionDTO.NombreLugar;
            eventoDB.Latitud = eventoCreacionDTO.Latitud;
            eventoDB.Longitud = eventoCreacionDTO.Longitud;
            eventoDB.FechaInicio = eventoCreacionDTO.FechaInicio;
            eventoDB.EsPublicitado = eventoCreacionDTO.EsPublicitado;
            eventoDB.Activo = eventoCreacionDTO.Activo;

            // Manejar la imagen
            if (eventoCreacionDTO.Imagen != null)
            {
                // Subir la nueva imagen
                if (!string.IsNullOrWhiteSpace(eventoDB.Imagen))
                {
                    await almacenadorArchivos.Borrar(eventoDB.Imagen, contenedor);
                }

                var nuevaUrlImagen = await almacenadorArchivos.Almacenar(contenedor, eventoCreacionDTO.Imagen);
                eventoDB.Imagen = nuevaUrlImagen;
            }

            // Si no se envía una nueva imagen, mantener la existente
            if (eventoCreacionDTO.Imagen == null && string.IsNullOrWhiteSpace(eventoDB.Imagen))
            {
                return BadRequest("El evento debe tener una imagen.");
            }

            context.Entry(eventoDB).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar el evento: {ex.Message}");
            }

            return NoContent();
        }



        //delete claim
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "esadmin")]
        public async Task<IActionResult> Delete(int id)
        {
            var evento = await context.Eventos.FirstOrDefaultAsync(e => e.Id == id);
            if (evento == null)
            {
                return NotFound("No se encontró el evento.");
            }

            // Validar que el usuario que elimina es el creador del evento
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
            if (evento.UsuarioId != usuarioId)
            {
                return Forbid("No tienes permiso para eliminar este evento.");
            }

            context.Remove(evento);
            await context.SaveChangesAsync();

            return Ok($"Se eliminó correctamente el evento con ID {id}.");
        }


        [HttpPatch("{id}/pausar")]
        [Authorize(Policy = "esproductora")]
        public async Task<IActionResult> PausarEvento(int id)
        {
            var evento = await context.Eventos.FindAsync(id);
            if (evento == null)
            {
                return NotFound();
            }

            // Cambiar el estado del evento
            evento.Activo = !evento.Activo;
            await context.SaveChangesAsync();

            return NoContent();
        }

        //[HttpDelete("{id:int}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var evento = await context.Eventos.FindAsync(id);
        //    if (evento == null)
        //    {
        //        return NotFound();
        //    }

        //    context.Eventos.Remove(evento);
        //    await context.SaveChangesAsync();

        //    return Ok($"Se elimino correctamente el evento de id {id}");
        //}

        [HttpPost("subirImagen")]
        public async Task<ActionResult<string>> SubirImagen([FromForm] IFormFile archivo)
        {
            var url = await almacenadorArchivos.Almacenar("eventos", archivo);
            return Ok(url);
        }
    }
}
