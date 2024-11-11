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
            
            if (httpContextAccessor.HttpContext == null || httpContextAccessor.HttpContext.User == null)
            {
                return null; 
            }

            
            var emailClaim = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email");

            if (emailClaim == null || string.IsNullOrEmpty(emailClaim.Value))
            {
                return null; 
            }

            
            var usuario = await userManager.FindByEmailAsync(emailClaim.Value);

            if (usuario == null)
        { 
                return null; 
            }
        
            
            return usuario.Id;
        }


    }
}
