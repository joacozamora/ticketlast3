using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TicketOn.Server.Entidades;
using TicketOn.Server.Servicios;

namespace TicketOn.Server.Controllers
{
    [ApiController]
    [Route("api/mercadopago")]
    public class MercadoPagoController : Controller
    {
        private readonly ApplicationDbContext context;
        private readonly IServicioUsuarios servicioUsuarios;

        public MercadoPagoController(ApplicationDbContext context, IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.servicioUsuarios = servicioUsuarios;
        }

        [HttpGet("autorizar")]
        public IActionResult AutorizarMercadoPago()
        {
            var clientId = "6998459718331446"; // Tu Client ID
            var redirectUri = "https://ticketlast3.onrender.com/api/mercadopago/callback"; // Callback URL

            var authUrl = $"https://auth.mercadopago.com.ar/authorization?response_type=code&client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope=offline_access";

            return Redirect(authUrl);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> CallbackMercadoPago(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=No se recibió el código de autorización.");
            }

            var clientId = "6998459718331446"; // Tu Client ID
            var clientSecret = "BeOALsCmSuKyZVJWOOjj30qhqj2rBhpf"; // Tu Client Secret
            var redirectUri = "https://ticketlast3.onrender.com/api/mercadopago/callback";

            try
            {
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

                if (!response.IsSuccessStatusCode)
                {
                    return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=Error al obtener el token de acceso.");
                }

                var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseBody);

                if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.AccessToken))
                {
                    return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=El token de acceso obtenido es inválido.");
                }

                var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
                if (string.IsNullOrEmpty(usuarioId))
                {
                    return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=No se pudo obtener el ID del usuario logueado.");
                }

                var usuarioMP = new UsuarioMercadoPago
                {
                    UsuarioId = usuarioId,
                    AccessToken = tokenResponse.AccessToken,
                    RefreshToken = tokenResponse.RefreshToken,
                    FechaExpiracion = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn)
                };

                var registroExistente = await context.UsuarioMercadoPago.FirstOrDefaultAsync(u => u.UsuarioId == usuarioId);
                if (registroExistente != null)
                {
                    registroExistente.AccessToken = usuarioMP.AccessToken;
                    registroExistente.RefreshToken = usuarioMP.RefreshToken;
                    registroExistente.FechaExpiracion = usuarioMP.FechaExpiracion;
                    context.UsuarioMercadoPago.Update(registroExistente);
                }
                else
                {
                    context.UsuarioMercadoPago.Add(usuarioMP);
                }

                await context.SaveChangesAsync();

                return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=exito");
            }
            catch (Exception ex)
            {
                return Redirect($"https://127.0.0.1:4200/mercadopago/confirmacion?estado=error&mensaje=Error interno: {Uri.EscapeDataString(ex.Message)}");
            }
        }



        [HttpGet("vinculado")]
        public async Task<IActionResult> VerificarVinculacion()
        {
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();
            var usuarioMercadoPago = await context.UsuarioMercadoPago.FirstOrDefaultAsync(ump => ump.UsuarioId == usuarioId);

            if (usuarioMercadoPago == null)
            {
                return NotFound("El usuario no tiene una cuenta de Mercado Pago vinculada.");
            }

            if (usuarioMercadoPago.FechaExpiracion <= DateTime.UtcNow)
            {
                var tokenRenovado = await RenovarToken(usuarioMercadoPago);
                if (!tokenRenovado)
                {
                    return BadRequest("El token ha expirado y no se pudo renovar.");
                }
            }

            return Ok("Cuenta vinculada y activa.");
        }

        private async Task<bool> RenovarToken(UsuarioMercadoPago usuarioMercadoPago)
        {
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

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error al renovar el token: {responseBody}");
                    return false;
                }

                var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseBody);
                usuarioMercadoPago.AccessToken = tokenResponse.AccessToken;
                usuarioMercadoPago.RefreshToken = tokenResponse.RefreshToken;
                usuarioMercadoPago.FechaExpiracion = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn);

                context.UsuarioMercadoPago.Update(usuarioMercadoPago);
                await context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al renovar el token: {ex.Message}");
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
