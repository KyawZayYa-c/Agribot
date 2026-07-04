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

    [HttpPost("send")]
    public async Task<IActionResult> SendCommand([FromBody] CommandRequest request)
    {
        // ✅ Validation
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid command request: {Errors}", ModelState);
            return BadRequest(ModelState);
        }

        // ✅ Command Validation
        var validCommands = new[] { "forward", "backward", "left", "right", "stop" };
        if (!validCommands.Contains(request.Command))
        {
            _logger.LogWarning("Invalid command: {Command}", request.Command);
            return BadRequest(new { error = "Invalid command. Allowed: forward, backward, left, right, stop" });
        }

        _logger.LogInformation("Sending command: {Command} = {Value}", request.Command, request.Value);

        try
        {
            var message = $"{{\"command\":\"{request.Command}\",\"value\":\"{request.Value}\"}}";
            await _webSocketService.SendToVehicleAsync(message);
            _logger.LogInformation("Command sent successfully: {Command}", request.Command);
            return Ok(new { message = "Command sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending command: {Command}", request.Command);
            return StatusCode(500, new { error = "Failed to send command" });
        }
    }
}