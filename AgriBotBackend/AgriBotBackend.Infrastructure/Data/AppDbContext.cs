using Microsoft.EntityFrameworkCore;  // ✅ ဒီ using ကို ထည့်ပါ
using AgriBotBackend.Core.Models;

namespace AgriBotBackend.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<Telemetry> Telemetries { get; set; }
    public DbSet<Command> Commands { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vehicle>()
            .HasIndex(v => v.VehicleId)
            .IsUnique();
            
        modelBuilder.Entity<Telemetry>()
            .HasIndex(t => new { t.VehicleId, t.Timestamp });
            
        modelBuilder.Entity<Command>()
            .HasIndex(c => new { c.VehicleId, c.Timestamp });
    }
}