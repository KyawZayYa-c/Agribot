namespace AgriBotBackend.API.Models;

public class UpdateCameraIpRequest
{
    public string VehicleId { get; set; } = string.Empty;
    public string CameraIp { get; set; } = string.Empty;
    public int CameraPort { get; set; } = 81;
}