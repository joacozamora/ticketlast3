using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class nuevamigraas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UsuarioId",
                table: "Entradas",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Entradas_UsuarioId",
                table: "Entradas",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entradas_AspNetUsers_UsuarioId",
                table: "Entradas",
                column: "UsuarioId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entradas_AspNetUsers_UsuarioId",
                table: "Entradas");

            migrationBuilder.DropIndex(
                name: "IX_Entradas_UsuarioId",
                table: "Entradas");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Entradas");
        }
    }
}
