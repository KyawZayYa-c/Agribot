using AgriBotBackend.API.Services;
using AgriBotBackend.API.Models;  
using Microsoft.AspNetCore.Mvc;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController : ControllerBase
{
    private readonly IWebSocketService _webSocketService;
    private readonly ILogger<StatusController> _logger; 

    public StatusController(IWebSocketService webSocketService, ILogger<StatusController> logger)
    {
        _webSocketService = webSocketService;
        _logger = logger;
    }

    [HttpGet("connection")]
    public IActionResult GetConnectionStatus()
    {
        _logger.LogInformation("Getting connection status");  
        var isConnected = _webSocketService.IsConnected();
        return Ok(new
        {
            isConnected = isConnected,
            status = isConnected ? "Connected" : "Disconnected",
            timestamp = DateTime.Now
        });
    }

    // ==========================================
    // ✅ Send Command - With Camera Support
    // ==========================================
    [HttpPost("send")]
    public async Task<IActionResult> SendCommand([FromBody] CommandRequest request)
    {
        // ✅ Validation - ပြန်ဖွင့်ပါ
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid command request: {Errors}", ModelState);
            return BadRequest(ModelState);
        }

        // ✅ Command Validation - Camera Commands ထည့်ပါ
        var validCommands = new[] { 
            "forward", "backward", "left", "right", "stop",
            "camera_up", "camera_down", "camera_left", "camera_right", "camera_stop"
        };
        
        if (!validCommands.Contains(request.Command))
        {
            _logger.LogWarning($"Invalid command: {request.Command}");
            return BadRequest(new { 
                error = "Invalid command. Allowed: forward, backward, left, right, stop, camera_up, camera_down, camera_left, camera_right, camera_stop" 
            });
        }

        _logger.LogInformation($"Sending command: {request.Command} = {request.Value}");

        try
        {
            var message = $"{{\"command\":\"{request.Command}\",\"value\":\"{request.Value}\"}}";
            await _webSocketService.SendToVehicleAsync(message);
            _logger.LogInformation($"Command sent successfully: {request.Command}");
            return Ok(new { message = "Command sent successfully" });
        }
        catch (InvalidOperationException ex)  // ✅ WebSocket မရှိရင်
        {
            _logger.LogWarning($"WebSocket not connected: {ex.Message}");
            return StatusCode(503, new { error = "ESP32 is not connected" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending command: {request.Command}");
            return StatusCode(500, new { error = "Failed to send command" });
        }
    }
}