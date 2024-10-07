using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class foreanea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdUsuario",
                table: "Eventos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Eventos",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_UserId",
                table: "Eventos",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_AspNetUsers_UserId",
                table: "Eventos",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_AspNetUsers_UserId",
                table: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_UserId",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "IdUsuario",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Eventos");
        }
    }
}
