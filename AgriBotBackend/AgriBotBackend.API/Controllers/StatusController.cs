using AgriBotBackend.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController : ControllerBase
{
    private readonly IWebSocketService _webSocketService;

    public StatusController(IWebSocketService webSocketService)
    {
        _webSocketService = webSocketService;
    }

    [HttpGet("connection")]
    public IActionResult GetConnectionStatus()
    {
        var isConnected = _webSocketService.IsConnected();
        return Ok(new
        {
            isConnected = isConnected,
            status = isConnected ? "Connected" : "Disconnected",
            timestamp = DateTime.Now
        });
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendCommand([FromBody] CommandRequest request)
    {
        var message = $"{{\"command\":\"{request.Command}\",\"value\":\"{request.Value}\"}}";
        await _webSocketService.SendToVehicleAsync(message);
        return Ok(new { message = "Command sent successfully" });
    }
}

public class CommandRequest
{
    public string Command { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}