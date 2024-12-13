using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using TicketOn.Server.DTOs;
using TicketOn.Server.DTOs.Claims;
using TicketOn.Server.DTOs.Paginacion;
using TicketOn.Server.DTOs.Seguridad;
using TicketOn.Server.DTOs.Usuario;
using TicketOn.Server.Entidades;
using TicketOn.Server.Utilidades;


namespace TicketOn.Server.Controllers
{
    [Route("api/usuarios")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "esadmin")]
    public class UsuariosController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public UsuariosController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager,
            IConfiguration configuration, ApplicationDbContext context, IMapper mapper)

        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet("ListadoUsuarios")]
        public async Task<ActionResult<List<UsuarioDTO>>> ListadoUsuarios([FromQuery] PaginacionDTO paginacionDTO)
        {
            var queryable = from user in context.Users
                            join detalle in context.Set<UsuarioDetalle>() on user.Id equals detalle.Id into detalles
                            from detalle in detalles.DefaultIfEmpty()
                            select new UsuarioDTO
                            {
                                Email = user.Email,
                                Nombre = detalle.Nombre,
                                Apellido = detalle.Apellido,
                                Telefono = detalle.Telefono,
                                DNI = detalle.DNI
                            };

            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            var usuarios = await queryable
                .OrderBy(x => x.Email)
                .Paginar(paginacionDTO)
                .ToListAsync();

            return usuarios;
        }

        

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<RespuestaAutenticacionDTO>> Registrar(CredencialesUsuarioDTO credencialesUsuarioDTO)
        {
            // Crear usuario en Identity
            var usuario = new IdentityUser
            {
                Email = credencialesUsuarioDTO.Email,
                UserName = credencialesUsuarioDTO.Email
            };

            var resultado = await userManager.CreateAsync(usuario, credencialesUsuarioDTO.Password);

            if (!resultado.Succeeded)
            {
                return BadRequest(resultado.Errors);
            }

            // Crear detalles del usuario en UsuarioDetalle
            var usuarioDetalle = new UsuarioDetalle
            {
                Id = usuario.Id, // Relación con IdentityUser
                Nombre = credencialesUsuarioDTO.Nombre,
                Apellido = credencialesUsuarioDTO.Apellido,
                Telefono = credencialesUsuarioDTO.Telefono,
                DNI = credencialesUsuarioDTO.DNI
            };

            context.Add(usuarioDetalle);
            await context.SaveChangesAsync();

            // Retornar el token del usuario registrado
            return await ConstruirToken(usuario);
        }

        

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<RespuestaAutenticacionDTO>> Login(CredencialesLoginDTO credenciales)
        {
            var usuario = await userManager.FindByEmailAsync(credenciales.Email);

            if (usuario is null)
            {
                var errores = ConstruirLoginIncorrecto();
                return BadRequest(errores);
            }

            var resultado = await signInManager.CheckPasswordSignInAsync(usuario, credenciales.Password, lockoutOnFailure: false);
            if (resultado.Succeeded)
            {
                return await ConstruirToken(usuario);
            }
            else
            {
                var errores = ConstruirLoginIncorrecto();
                return BadRequest(errores);
            }

        }

        [HttpPost("HacerAdmin")]
        public async Task<IActionResult> HacerAdmin(EditarClaimDto editarClaimDTO)
        {
            var usuario = await userManager.FindByEmailAsync(editarClaimDTO.Email);
            
            if(usuario is null)
            {
                return NotFound();
            }

            await userManager.AddClaimAsync(usuario, new Claim("esadmin", "true"));
            return NoContent();
        }

        [HttpPost("RemoverAdmin")]
        public async Task<IActionResult> RemoverAdmin(EditarClaimDto editarClaimDTO)
        {
            var usuario = await userManager.FindByEmailAsync(editarClaimDTO.Email);

            if (usuario is null)
            {
                return NotFound();
            }

            await userManager.RemoveClaimAsync(usuario, new Claim("esadmin", "true"));
            return NoContent();
        }

        [HttpPost("HacerProductora")]
        public async Task<IActionResult> HacerProductora(EditarClaimDto editarClaimDTO)
        {
            var usuario = await userManager.FindByEmailAsync(editarClaimDTO.Email);

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            await userManager.AddClaimAsync(usuario, new Claim("esproductora", "true"));
            return NoContent();
        }

        [HttpPost("RemoverProductora")]
        public async Task<IActionResult> RemoverProductora(EditarClaimDto editarClaimDTO)
        {
            var usuario = await userManager.FindByEmailAsync(editarClaimDTO.Email);

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            await userManager.RemoveClaimAsync(usuario, new Claim("esproductora", "true"));
            return NoContent();
        }

        private async Task<RespuestaAutenticacionDTO> ConstruirToken(IdentityUser identityUser)
        {
            var claims = new List<Claim>
    {
        new Claim("email", identityUser.Email!),
        new Claim("lo que yo quiera", "Cualquier valor")
    };

            // Obtener los claims del usuario desde la base de datos
            var claimsDB = await userManager.GetClaimsAsync(identityUser);
            claims.AddRange(claimsDB);

            // Configurar el token JWT
            var llave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["llavejwt"]!));
            var creds = new SigningCredentials(llave, SecurityAlgorithms.HmacSha256);

            var expiracion = DateTime.UtcNow.AddYears(1);

            var tokenDeSeguridad = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
                expires: expiracion, signingCredentials: creds);

            var token = new JwtSecurityTokenHandler().WriteToken(tokenDeSeguridad);

            return new RespuestaAutenticacionDTO
            {
                Token = token,
                Expiracion = expiracion
            };
        }

        [HttpPut("actualizar/{email}")]
        public async Task<IActionResult> ActualizarUsuario(string email, [FromBody] UsuarioActualizacionDTO usuarioActualizado)
        {
            if (usuarioActualizado == null)
            {
                return BadRequest("Los datos del usuario son inválidos.");
            }

            // Buscar el usuario en Identity
            var usuarioIdentity = await userManager.FindByEmailAsync(email);
            if (usuarioIdentity == null)
            {
                return NotFound("No se encontró un usuario con ese correo.");
            }

            // Actualizar el correo en Identity (si cambió)
            if (!string.Equals(usuarioIdentity.Email, usuarioActualizado.Email, StringComparison.OrdinalIgnoreCase))
            {
                usuarioIdentity.Email = usuarioActualizado.Email;
                usuarioIdentity.UserName = usuarioActualizado.Email;
                var resultadoIdentity = await userManager.UpdateAsync(usuarioIdentity);

                if (!resultadoIdentity.Succeeded)
                {
                    return BadRequest($"No se pudo actualizar el correo del usuario: {string.Join(", ", resultadoIdentity.Errors.Select(e => e.Description))}");
                }
            }

            // Buscar el detalle del usuario en la base de datos
            var usuarioDetalle = await context.Set<UsuarioDetalle>().FirstOrDefaultAsync(ud => ud.Id == usuarioIdentity.Id);
            if (usuarioDetalle == null)
            {
                return NotFound("No se encontraron detalles para este usuario.");
            }

            // Actualizar los detalles del usuario
            if (!string.IsNullOrWhiteSpace(usuarioActualizado.Nombre))
                usuarioDetalle.Nombre = usuarioActualizado.Nombre;

            if (!string.IsNullOrWhiteSpace(usuarioActualizado.Apellido))
                usuarioDetalle.Apellido = usuarioActualizado.Apellido;

            if (!string.IsNullOrWhiteSpace(usuarioActualizado.Telefono))
                usuarioDetalle.Telefono = usuarioActualizado.Telefono;

            if (!string.IsNullOrWhiteSpace(usuarioActualizado.DNI))
                usuarioDetalle.DNI = usuarioActualizado.DNI;

            try
            {
                // Guardar los cambios en la base de datos
                await context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Error al guardar los cambios en la base de datos: {ex.Message}");
            }

            return NoContent();
        }


        [HttpGet("{email}")]
        public async Task<ActionResult<UsuarioDTO>> ObtenerUsuarioPorCorreo(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("El correo proporcionado no es válido.");
            }

            var usuario = await context.Users
                .Where(u => u.Email == email)
                .Join(context.Set<UsuarioDetalle>(),
                      user => user.Id,
                      detalle => detalle.Id,
                      (user, detalle) => new UsuarioDTO
                      {
                          Email = user.Email,
                          Nombre = detalle.Nombre,
                          Apellido = detalle.Apellido,
                          Telefono = detalle.Telefono,
                          DNI = detalle.DNI
                      })
                .FirstOrDefaultAsync();

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            return Ok(usuario);
        }



        private IEnumerable<IdentityError> ConstruirLoginIncorrecto()
        {
            var identityError = new IdentityError() { Description = "Login Incorrecto" };

            var errores = new List<IdentityError>();
            errores.Add(identityError);
            return errores;
        }
    }
}