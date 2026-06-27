using Microsoft.AspNetCore.SignalR;
using AgriBotBackend.API.Services;

namespace AgriBotBackend.API.Hubs;

public class AgriBotHub : Hub
{
    private readonly IWebSocketService _webSocketService;
    
    public AgriBotHub(IWebSocketService webSocketService)
    {
        _webSocketService = webSocketService;
    }
    
    // React Native App က Command ပို့တဲ့အခါ
    public async Task SendCommand(string command, string value)
    {
        var message = $"{{\"command\":\"{command}\",\"value\":\"{value}\"}}";
        await _webSocketService.SendToVehicleAsync(message);
    }
}