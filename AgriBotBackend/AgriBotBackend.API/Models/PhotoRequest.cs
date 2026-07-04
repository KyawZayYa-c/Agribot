namespace AgriBotBackend.API.Models;

public class PhotoRequest
{
    public string VehicleId { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty;  // Base64 Image
    public string Format { get; set; } = "jpeg";
    public DateTime Timestamp { get; set; } = DateTime.Now;
}