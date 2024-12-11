using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;
using Microsoft.Extensions.Logging;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/mercadopago")]
    public class MercadoPagoController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IServicioUsuarios servicioUsuarios;
        private readonly ILogger<MercadoPagoController> logger;

        public MercadoPagoController(ApplicationDbContext context, IServicioUsuarios servicioUsuarios, ILogger<MercadoPagoController> logger)
        {
            this.context = context;
            this.servicioUsuarios = servicioUsuarios;
            this.logger = logger;
        }

        [HttpGet("autorizar")]
        public IActionResult AutorizarMercadoPago()
        {
            logger.LogInformation("Iniciando autorización para MercadoPago");

            var clientId = "6998459718331446";
            var redirectUri = $"https://ticketlast3.onrender.com/api/mercadopago/callback";
            var authUrl = $"https://auth.mercadopago.com.ar/authorization?response_type=code&client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope=offline_access";

            logger.LogInformation($"Redireccionando a URL de autorización: {authUrl}");
            return Redirect(authUrl);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> CallbackMercadoPago(string code)
        {
            logger.LogInformation($"Callback recibido de MercadoPago. Código: {code}");

            if (string.IsNullOrEmpty(code))
            {
                logger.LogError("No se recibió el código de autorización");
                return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=No se recibió el código de autorización.");
            }

            try
            {
                logger.LogInformation("Preparando solicitud para obtener token de acceso...");
                var clientId = "6998459718331446";
                var clientSecret = "BeOALsCmSuKyZVJWOOjj30qhqj2rBhpf";
                var redirectUri = $"https://ticketlast3.onrender.com/api/mercadopago/callback";

                using var httpClient = new HttpClient();
                var requestContent = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "authorization_code"),
                    new KeyValuePair<string, string>("client_id", clientId),
                    new KeyValuePair<string, string>("client_secret", clientSecret),
                    new KeyValuePair<string, string>("code", code),
                    new KeyValuePair<string, string>("redirect_uri", redirectUri)
                });

                var response = await httpClient.PostAsync("https://api.mercadopago.com/oauth/token", requestContent);
                var responseBody = await response.Content.ReadAsStringAsync();
                logger.LogInformation($"Respuesta de MercadoPago: {responseBody}");

                if (!response.IsSuccessStatusCode)
                {
                    logger.LogError("Error al obtener el token de acceso desde MercadoPago");
                    return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=Error al obtener el token de acceso.");
                }

                var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseBody);
                if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.AccessToken))
                {
                    logger.LogError("El token de acceso obtenido es inválido");
                    return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=Token de acceso inválido.");
                }

                // Guardar token básico sin usuarioId
                logger.LogInformation("Guardando token en la base de datos sin usuario asociado...");
                var usuarioMP = new UsuarioMercadoPago
                {
                    UsuarioId = null, // Inicialmente nulo
                    AccessToken = tokenResponse.AccessToken,
                    RefreshToken = tokenResponse.RefreshToken,
                    FechaExpiracion = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn)
                };

                context.UsuarioMercadoPago.Add(usuarioMP);
                await context.SaveChangesAsync();
                logger.LogInformation("Token guardado correctamente.");

                // Asociar el usuario
                var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
                if (!string.IsNullOrEmpty(usuarioId))
                {
                    logger.LogInformation($"Asociando el usuario {usuarioId} al registro de MercadoPago...");
                    usuarioMP.UsuarioId = usuarioId;
                    context.UsuarioMercadoPago.Update(usuarioMP);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Usuario asociado correctamente.");
                }
                else
                {
                    logger.LogWarning("No se pudo obtener el usuario ID para asociarlo.");
                }

                return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=exito");
            }
            catch (Exception ex)
            {
                logger.LogError($"Error en el callback: {ex.Message}");
                return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=Error interno.");
            }
        }

        [HttpGet("vinculado")]
        public async Task<IActionResult> VerificarVinculacion()
        {
            logger.LogInformation("Verificando vinculación de cuenta MercadoPago");

            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
            if (string.IsNullOrEmpty(usuarioId))
            {
                return Unauthorized("Usuario no autenticado.");
            }

            var usuarioMercadoPago = await context.UsuarioMercadoPago.FirstOrDefaultAsync(ump => ump.UsuarioId == usuarioId);
            if (usuarioMercadoPago == null)
            {
                logger.LogWarning("El usuario no tiene una cuenta vinculada a MercadoPago.");
                return NotFound("El usuario no tiene una cuenta de Mercado Pago vinculada.");
            }

            if (usuarioMercadoPago.FechaExpiracion <= DateTime.UtcNow)
            {
                logger.LogInformation("El token ha expirado. Intentando renovar...");
                var tokenRenovado = await RenovarToken(usuarioMercadoPago);
                if (!tokenRenovado)
                {
                    logger.LogError("El token ha expirado y no se pudo renovar.");
                    return BadRequest("El token ha expirado y no se pudo renovar.");
                }
            }

            logger.LogInformation("Cuenta vinculada y activa.");
            return Ok("Cuenta vinculada y activa.");
        }

        private async Task<bool> RenovarToken(UsuarioMercadoPago usuarioMercadoPago)
        {
            logger.LogInformation("Intentando renovar el token de MercadoPago");
            var clientId = "6998459718331446";
            var clientSecret = "BeOALsCmSuKyZVJWOOjj30qhqj2rBhpf";

            try
            {
                using var httpClient = new HttpClient();
                var requestContent = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "refresh_token"),
                    new KeyValuePair<string, string>("client_id", clientId),
                    new KeyValuePair<string, string>("client_secret", clientSecret),
                    new KeyValuePair<string, string>("refresh_token", usuarioMercadoPago.RefreshToken)
                });

                var response = await httpClient.PostAsync("https://api.mercadopago.com/oauth/token", requestContent);
                var responseBody = await response.Content.ReadAsStringAsync();

                logger.LogInformation($"Respuesta de MercadoPago al renovar token: {responseBody}");

                if (!response.IsSuccessStatusCode)
                {
                    logger.LogError($"Error al renovar el token: {responseBody}");
                    return false;
                }

                var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseBody);
                usuarioMercadoPago.AccessToken = tokenResponse.AccessToken;
                usuarioMercadoPago.RefreshToken = tokenResponse.RefreshToken;
                usuarioMercadoPago.FechaExpiracion = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn);

                context.UsuarioMercadoPago.Update(usuarioMercadoPago);
                await context.SaveChangesAsync();

                logger.LogInformation("Token renovado y guardado exitosamente.");
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError($"Error al renovar el token: {ex.Message}");
                return false;
            }
        }

        public class TokenResponse
        {
            [JsonProperty("access_token")]
            public string AccessToken { get; set; }

            [JsonProperty("refresh_token")]
            public string RefreshToken { get; set; }

            [JsonProperty("expires_in")]
            public int ExpiresIn { get; set; }
        }
    }
}





//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Newtonsoft.Json;
//using TicketOn.Server.Entidades;
//using TicketOn.Server.Servicios;

//namespace TicketOn.Server.Controllers
//{
//    [ApiController]
//    [Route("api/mercadopago")]
//    public class MercadoPagoController : Controller
//    {
//        private readonly ApplicationDbContext context;
//        private readonly IServicioUsuarios servicioUsuarios;

//        public MercadoPagoController(ApplicationDbContext context, IServicioUsuarios servicioUsuarios)
//        {
//            this.context = context;
//            this.servicioUsuarios = servicioUsuarios;
//        }

//        [HttpGet("autorizar")]
//        public IActionResult AutorizarMercadoPago()
//        {
//            var clientId = "6998459718331446"; // Tu Client ID
//            var redirectUri = "https://localhost:7225/api/mercadopago/callback"; // Cambia esto por tu URL de callback

//            var authUrl = $"https://auth.mercadopago.com.ar/authorization?response_type=code&client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope=offline_access";

//            return Redirect(authUrl);
//        }

//        [HttpGet("callback")]
//        public async Task<IActionResult> CallbackMercadoPago(string code)
//        {
//            if (string.IsNullOrEmpty(code))
//            {
//                return BadRequest("No se recibió el código de autorización.");
//            }

//            var clientId = "6998459718331446"; // Tu Client ID
//            var clientSecret = "BeOALsCmSuKyZVJWOOjj30qhqj2rBhpf"; // Tu Client Secret
//            var redirectUri = "https://localhost:7225/api/mercadopago/callback";

//            using var httpClient = new HttpClient();
//            var requestContent = new FormUrlEncodedContent(new[]
//            {
//        new KeyValuePair<string, string>("grant_type", "authorization_code"),
//        new KeyValuePair<string, string>("client_id", clientId),
//        new KeyValuePair<string, string>("client_secret", clientSecret),
//        new KeyValuePair<string, string>("code", code),
//        new KeyValuePair<string, string>("redirect_uri", redirectUri)
//    });

//            var response = await httpClient.PostAsync("https://api.mercadopago.com/oauth/token", requestContent);
//            if (!response.IsSuccessStatusCode)
//            {
//                return StatusCode((int)response.StatusCode, "Error al obtener el token de acceso.");
//            }

//            var responseBody = await response.Content.ReadAsStringAsync();
//            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseBody);

//            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
//            var usuarioMP = new UsuarioMercadoPago
//            {
//                UsuarioId = usuarioId,
//                AccessToken = tokenResponse.AccessToken,
//                RefreshToken = tokenResponse.RefreshToken,
//                FechaExpiracion = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn)
//            };

//            var registroExistente = await context.UsuarioMercadoPago.FirstOrDefaultAsync(u => u.UsuarioId == usuarioId);
//            if (registroExistente != null)
//            {
//                registroExistente.AccessToken = usuarioMP.AccessToken;
//                registroExistente.RefreshToken = usuarioMP.RefreshToken;
//                registroExistente.FechaExpiracion = usuarioMP.FechaExpiracion;
//                context.UsuarioMercadoPago.Update(registroExistente);
//            }
//            else
//            {
//                context.UsuarioMercadoPago.Add(usuarioMP);
//            }

//            await context.SaveChangesAsync();
//            return Redirect("https://127.0.0.1:4200");
//        }

//        public class TokenResponse
//        {
//            [JsonProperty("access_token")]
//            public string AccessToken { get; set; }

//            [JsonProperty("refresh_token")]
//            public string RefreshToken { get; set; }

//            [JsonProperty("expires_in")]
//            public int ExpiresIn { get; set; }
//        }


//        [HttpGet("vinculado")]
//        public async Task<IActionResult> VerificarVinculacion()
//        {
//            var usuarioId = await servicioUsuarios.ObtenerUsuarioId(); // Tu lógica para obtener el usuario actual
//            var usuarioMercadoPago = await context.UsuarioMercadoPago.FirstOrDefaultAsync(ump => ump.UsuarioId == usuarioId);

//            if (usuarioMercadoPago == null || usuarioMercadoPago.FechaExpiracion <= DateTime.UtcNow)
//            {
//                return NotFound("El usuario no tiene una cuenta de MercadoPago vinculada o el token ha expirado.");
//            }

//            return Ok("Cuenta vinculada.");
//        }
//    }
//}
