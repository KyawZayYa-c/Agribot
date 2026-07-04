using Microsoft.AspNetCore.Mvc;
using AgriBotBackend.API.Models;
using AgriBotBackend.API.Services;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIChatController : ControllerBase
{
    private readonly IAIChatService _aiChatService;
    private readonly ILogger<AIChatController> _logger;

    public AIChatController(IAIChatService aiChatService, ILogger<AIChatController> logger)
    {
        _aiChatService = aiChatService;
        _logger = logger;
    }

    // POST: api/aichat/message
    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { error = "Message is required" });
        }

        try
        {
            _logger.LogInformation($"Received chat request: {request.Message}");
            var response = await _aiChatService.SendMessageAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in chat endpoint");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    // GET: api/aichat/features
    [HttpGet("features")]
    public IActionResult GetFeatures()
    {
        var features = new[]
        {
            new { id = "crop", label = "🌾 Crop Recommendation", icon = "leaf" },
            new { id = "disease", label = "🦠 Disease Guide", icon = "bug" },
            new { id = "pest", label = "🐛 Pest Control", icon = "pest" },
            new { id = "fertilizer", label = "🌱 Fertilizer Guide", icon = "sprout" },
            new { id = "farming", label = "📖 Farming Guide", icon = "book" },
            new { id = "weather", label = "☁️ Weather Advice", icon = "cloud" },
            new { id = "general", label = "❓ Ask Anything", icon = "help" }
        };

        return Ok(features);
    }
}