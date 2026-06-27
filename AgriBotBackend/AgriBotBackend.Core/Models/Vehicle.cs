namespace AgriBotBackend.Core.Models;

public class Vehicle
{
    public int Id { get; set; }
    public string VehicleId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "Idle";
    public string Mode { get; set; } = "Manual";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}