using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class fkevento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entradas_Eventos_EventoId",
                table: "Entradas");

            migrationBuilder.DropIndex(
                name: "IX_Entradas_EventoId",
                table: "Entradas");

            migrationBuilder.DropColumn(
                name: "EventoId",
                table: "Entradas");

            migrationBuilder.CreateIndex(
                name: "IX_Entradas_IdEvento",
                table: "Entradas",
                column: "IdEvento");

            migrationBuilder.AddForeignKey(
                name: "FK_Entradas_Eventos_IdEvento",
                table: "Entradas",
                column: "IdEvento",
                principalTable: "Eventos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entradas_Eventos_IdEvento",
                table: "Entradas");

            migrationBuilder.DropIndex(
                name: "IX_Entradas_IdEvento",
                table: "Entradas");

            migrationBuilder.AddColumn<int>(
                name: "EventoId",
                table: "Entradas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Entradas_EventoId",
                table: "Entradas",
                column: "EventoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entradas_Eventos_EventoId",
                table: "Entradas",
                column: "EventoId",
                principalTable: "Eventos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
