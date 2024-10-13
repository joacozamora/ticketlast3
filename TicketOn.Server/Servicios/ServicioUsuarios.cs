using Microsoft.AspNetCore.Identity;

namespace TicketOn.Server.Servicios
{
    public class ServicioUsuarios : IServicioUsuarios
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly UserManager<IdentityUser> userManager;

        public ServicioUsuarios(IHttpContextAccessor httpContextAccessor,
            UserManager<IdentityUser> userManager)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.userManager = userManager;
        }

        public async Task<string?> ObtenerUsuarioId()
        {
            // Verifica si HttpContext o User es null
            if (httpContextAccessor.HttpContext == null || httpContextAccessor.HttpContext.User == null)
            {
                return null; // O lanza una excepción personalizada si prefieres
            }

            // Intenta obtener el email del usuario
            var emailClaim = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email");

            if (emailClaim == null || string.IsNullOrEmpty(emailClaim.Value))
            {
                return null; // O lanza una excepción personalizada si prefieres
            }

            // Busca el usuario por el email
            var usuario = await userManager.FindByEmailAsync(emailClaim.Value);

            // Verifica si el usuario es null
            if (usuario == null)
            {
                return null; // O lanza una excepción personalizada si prefieres
            }

            // Devuelve el Id del usuario
            return usuario.Id;
        }


    }
}
