namespace AgriBotBackend.Core.Models;

public class Command
{
    public int Id { get; set; }
    public string VehicleId { get; set; } = string.Empty;
    public string CommandType { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsExecuted { get; set; }
}