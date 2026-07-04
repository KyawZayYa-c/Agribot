namespace AgriBotBackend.API.Models;

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
    public string? Feature { get; set; } // crop, disease, pest, fertilizer, farming, weather, general
    public string? Location { get; set; }
    public string? SoilType { get; set; }
    public string? Season { get; set; }
}