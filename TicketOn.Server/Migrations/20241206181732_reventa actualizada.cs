using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class reventaactualizada : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompradorId",
                table: "Reventas",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Reventas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaReventa",
                table: "Reventas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reventas_CompradorId",
                table: "Reventas",
                column: "CompradorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reventas_AspNetUsers_CompradorId",
                table: "Reventas",
                column: "CompradorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reventas_AspNetUsers_CompradorId",
                table: "Reventas");

            migrationBuilder.DropIndex(
                name: "IX_Reventas_CompradorId",
                table: "Reventas");

            migrationBuilder.DropColumn(
                name: "CompradorId",
                table: "Reventas");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Reventas");

            migrationBuilder.DropColumn(
                name: "FechaReventa",
                table: "Reventas");
        }
    }
}
