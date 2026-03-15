using BookAPI.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) {}

    public DbSet<Book> Books { get; set; }

    public DbSet<Chapter> Chapters { get; set; }

    public DbSet<ContentWarning> ContentWarnings { get; set; }
}