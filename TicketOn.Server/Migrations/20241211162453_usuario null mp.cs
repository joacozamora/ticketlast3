﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketOn.Server.Migrations
{
    /// <inheritdoc />
    public partial class usuarionullmp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsuarioMercadoPago_AspNetUsers_UsuarioId",
                table: "UsuarioMercadoPago");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioId",
                table: "UsuarioMercadoPago",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_UsuarioMercadoPago_AspNetUsers_UsuarioId",
                table: "UsuarioMercadoPago",
                column: "UsuarioId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsuarioMercadoPago_AspNetUsers_UsuarioId",
                table: "UsuarioMercadoPago");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioId",
                table: "UsuarioMercadoPago",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UsuarioMercadoPago_AspNetUsers_UsuarioId",
                table: "UsuarioMercadoPago",
                column: "UsuarioId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
