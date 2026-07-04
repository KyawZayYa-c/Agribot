namespace AgriBotBackend.API.Models;

public class ChatResponse
{
    public string Reply { get; set; } = string.Empty;
    public string? Feature { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
}