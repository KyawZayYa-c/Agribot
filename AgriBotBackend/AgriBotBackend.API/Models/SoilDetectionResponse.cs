namespace AgriBotBackend.API.Models;

public class SoilDetectionResponse
{
    public string SoilType { get; set; } = string.Empty;
    public string SoilName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public List<string> Crops { get; set; } = new();
    public double Confidence { get; set; }
    public string AudioUrl { get; set; } = string.Empty;
}