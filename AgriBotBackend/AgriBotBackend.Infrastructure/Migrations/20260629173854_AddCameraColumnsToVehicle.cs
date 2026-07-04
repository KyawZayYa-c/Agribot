using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriBotBackend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCameraColumnsToVehicle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CameraIp",
                table: "Vehicles",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CameraPort",
                table: "Vehicles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CameraStreamPath",
                table: "Vehicles",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CameraIp",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "CameraPort",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "CameraStreamPath",
                table: "Vehicles");
        }
    }
}
