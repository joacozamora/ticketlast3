﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using TicketOn.Server.DTOs.Eventos;
using TicketOn.Server.DTOs.Generos;
using TicketOn.Server.Entidades;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/generos")]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "esadmin")]
    public class GenerosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        //private readonly object outputCacheStore;
        //private const string cacheTag = "generos";

        public GenerosController(ApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        //[HttpGet]
        //[OutputCache(Tags = [cacheTag])]
        //public async Task<List<GeneroDTO>> Get([FormQuery] PaginacionDTO paginacion) 

        [HttpGet]
        public async Task<ActionResult<List<GeneroDTO>>> Get()
        {

            var generos = await context.Generos.ProjectTo<GeneroDTO>(mapper.ConfigurationProvider).ToListAsync();


            if (generos == null || generos.Count == 0)
            {
                return BadRequest("No hay Generos cargados");
            }

            return generos;
        }

        [HttpGet("{id:int}", Name = "ObtenerGeneroPorId")]
        public async Task<ActionResult<GeneroDTO>> Get(int id)
        {
            var genero = await context.Generos
                 .ProjectTo<GeneroDTO>(mapper.ConfigurationProvider)
                 .FirstOrDefaultAsync(g => g.Id == id);

            if (genero == null)
            {
                return NotFound();
            }

            return genero;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            var genero = mapper.Map<Genero>(generoCreacionDTO);
            context.Add(genero);
            await context.SaveChangesAsync();
            return CreatedAtRoute("ObtenerGeneroPorId", new { id = genero.Id }, genero);

        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            var generoExiste = await context.Generos.AnyAsync(g => g.Id == id);

            if (!generoExiste)
            {
                return NotFound();
            }

            var genero = mapper.Map<Genero>(generoCreacionDTO);
            genero.Id = id;

            context.Generos.Update(genero);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var genero = await context.Generos.FindAsync(id);
            if (genero == null)
            {
                return NotFound();
            }

            context.Generos.Remove(genero);
            await context.SaveChangesAsync();

            return Ok($"Se elimino correctamente el genero de id {id}");
        }
    }
}
