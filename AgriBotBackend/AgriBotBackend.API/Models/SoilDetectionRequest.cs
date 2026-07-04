namespace AgriBotBackend.API.Models;

public class SoilDetectionRequest
{
    public string? ImageBase64 { get; set; }  // Python ကနေ လာမယ့် Image Data
    public string? SoilType { get; set; }     // Manual Selection အတွက်
}