using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class cambiosderelaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reventas_Entradas_EntradaId",
                table: "Reventas");

            migrationBuilder.RenameColumn(
                name: "EntradaId",
                table: "Reventas",
                newName: "EntradaVentaId");

            migrationBuilder.RenameIndex(
                name: "IX_Reventas_EntradaId",
                table: "Reventas",
                newName: "IX_Reventas_EntradaVentaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reventas_EntradasVenta_EntradaVentaId",
                table: "Reventas",
                column: "EntradaVentaId",
                principalTable: "EntradasVenta",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reventas_EntradasVenta_EntradaVentaId",
                table: "Reventas");

            migrationBuilder.RenameColumn(
                name: "EntradaVentaId",
                table: "Reventas",
                newName: "EntradaId");

            migrationBuilder.RenameIndex(
                name: "IX_Reventas_EntradaVentaId",
                table: "Reventas",
                newName: "IX_Reventas_EntradaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reventas_Entradas_EntradaId",
                table: "Reventas",
                column: "EntradaId",
                principalTable: "Entradas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
