using Microsoft.AspNetCore.Mvc;
using AgriBotBackend.API.Models;
using AgriBotBackend.API.Services;
using AgriBotBackend.API.Data;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SoilController : ControllerBase
{
    private readonly ISoilDetectionService _soilService;
    private readonly ILogger<SoilController> _logger;

    public SoilController(ISoilDetectionService soilService, ILogger<SoilController> logger)
    {
        _soilService = soilService;
        _logger = logger;
    }

    // GET: api/soil/types
    [HttpGet("types")]
    public IActionResult GetSoilTypes()  
    {
        try
        {
            var types = SoilData.SoilTypes.Values.ToList();
            return Ok(types);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get soil types");
            return StatusCode(500, new { error = "Failed to get soil types" });
        }
    }

    // POST: api/soil/detect
    [HttpPost("detect")]
    public async Task<IActionResult> DetectSoil([FromBody] SoilDetectionRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.SoilType))
            {
                return BadRequest(new { error = "SoilType is required" });
            }
            
            var result = await _soilService.DetectSoilAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Soil detection failed");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}