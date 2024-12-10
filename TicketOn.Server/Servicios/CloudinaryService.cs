using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using TicketOn.Server.Config;

namespace TicketOn.Server.Servicios
{
    public class CloudinaryService : IAlmacenadorArchivos
    {
        private readonly Cloudinary cloudinary;

        public CloudinaryService(IOptions<CloudinarySettings> config)
        {
            Console.WriteLine($"CloudName: {config.Value.CloudName}, ApiKey: {config.Value.ApiKey}, ApiSecret: {config.Value.ApiSecret}");
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            cloudinary = new Cloudinary(account);
        }

        public async Task<string> Almacenar(string contenedor, IFormFile archivo)
        {
            using var stream = archivo.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(archivo.FileName, stream),
                Folder = contenedor // El contenedor se usa como la carpeta en Cloudinary
            };

            var uploadResult = await cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                throw new Exception(uploadResult.Error.Message);
            }

            return uploadResult.SecureUrl.ToString();
        }

        public async Task Borrar(string? ruta, string contenedor)
        {
            if (string.IsNullOrEmpty(ruta))
            {
                return;
            }

            var publicId = ruta.Split('/').Last().Split('.').First();
            var deleteParams = new DeletionParams(publicId);

            var result = await cloudinary.DestroyAsync(deleteParams);

            if (result.Result != "ok")
            {
                throw new Exception("Error al eliminar la imagen de Cloudinary.");
            }
        }
    }
}
