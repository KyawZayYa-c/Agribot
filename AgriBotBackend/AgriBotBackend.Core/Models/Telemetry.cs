namespace AgriBotBackend.Core.Models;
public class Telemetry
{
    public int Id { get; set; }
    public string VehicleId { get; set; } = string.Empty;
    public int Battery { get; set; }
    public int SeedLevel { get; set; }
    public double AreaCovered { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}