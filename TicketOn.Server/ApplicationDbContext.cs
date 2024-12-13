using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using TicketOn.Server.Entidades;

namespace TicketOn.Server
{
    public class ApplicationDbContext: IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions options):base(options)
        {
            
        }

        public DbSet<Entrada> Entradas { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Genero> Generos { get; set; }
        public DbSet<Tanda> Tandas { get; set; }
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<DetalleVenta> DetallesVenta { get; set; }
        public DbSet<EntradaVenta> EntradasVenta { get; set; }
        public DbSet<Reventa> Reventas { get; set; }
        public DbSet<UsuarioMercadoPago> UsuarioMercadoPago { get; set; }
        public DbSet<UsuarioDetalle> UsuarioDetalles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UsuarioDetalle>()
           .HasKey(u => u.Id);

            modelBuilder.Entity<UsuarioDetalle>()
                .HasOne(u => u.IdentityUser)
                .WithOne()
                .HasForeignKey<UsuarioDetalle>(u => u.Id);


            var cascadeFKs = modelBuilder.Model.GetEntityTypes()
                .SelectMany(t => t.GetForeignKeys())
                .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

            foreach (var fk in cascadeFKs)
            {
                fk.DeleteBehavior = DeleteBehavior.Restrict;
            }



            
        }

    }
}
