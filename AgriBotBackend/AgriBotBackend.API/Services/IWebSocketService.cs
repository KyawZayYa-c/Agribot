using System.Net.WebSockets;

namespace AgriBotBackend.API.Services;

public interface IWebSocketService
{
    Task HandleWebSocketConnectionAsync(HttpContext context);
    Task SendToVehicleAsync(string message);
    bool IsConnected();
}