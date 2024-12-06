using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class sacarqrdedetalleventa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodigoQR",
                table: "DetallesVenta");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CodigoQR",
                table: "DetallesVenta",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
