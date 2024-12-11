using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class cambiotablamercadopago : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UsuarioId",
                table: "UsuarioMercadoPago",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_UsuarioMercadoPago_UsuarioId",
                table: "UsuarioMercadoPago",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_UsuarioMercadoPago_AspNetUsers_UsuarioId",
                table: "UsuarioMercadoPago",
                column: "UsuarioId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsuarioMercadoPago_AspNetUsers_UsuarioId",
                table: "UsuarioMercadoPago");

            migrationBuilder.DropIndex(
                name: "IX_UsuarioMercadoPago_UsuarioId",
                table: "UsuarioMercadoPago");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioId",
                table: "UsuarioMercadoPago",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
