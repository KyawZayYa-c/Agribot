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

    public string? CameraIp { get; set; } 
    public int CameraPort { get; set; } = 81;  
    public string CameraStreamPath { get; set; } = "/stream";  
}