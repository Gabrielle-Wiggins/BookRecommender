using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddContentWarnings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContentWarnings",
                table: "Chapters");

            migrationBuilder.AddColumn<int>(
                name: "FaithElements",
                table: "Books",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxOccultLevel",
                table: "Books",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxProfanityLevel",
                table: "Books",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxSexualContentLevel",
                table: "Books",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxViolenceLevel",
                table: "Books",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ContentWarnings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Level = table.Column<int>(type: "INTEGER", nullable: false),
                    ChapterId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContentWarnings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContentWarnings_Chapters_ChapterId",
                        column: x => x.ChapterId,
                        principalTable: "Chapters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContentWarnings_ChapterId",
                table: "ContentWarnings",
                column: "ChapterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContentWarnings");

            migrationBuilder.DropColumn(
                name: "FaithElements",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "MaxOccultLevel",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "MaxProfanityLevel",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "MaxSexualContentLevel",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "MaxViolenceLevel",
                table: "Books");

            migrationBuilder.AddColumn<string>(
                name: "ContentWarnings",
                table: "Chapters",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
