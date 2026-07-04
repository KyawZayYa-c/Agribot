using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.Core.Models;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<TelemetryController> _logger;  
    

    public TelemetryController(AppDbContext dbContext, ILogger<TelemetryController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    // GET: api/telemetry/latest
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestTelemetry([FromQuery] string vehicleId = "unknown")
    {
        try
        {
            _logger.LogInformation("Getting latest telemetry for vehicle: {VehicleId}", vehicleId);

            var telemetry = await _dbContext.Telemetries
                .Where(t => t.VehicleId == vehicleId)
                .OrderByDescending(t => t.Timestamp)
                .FirstOrDefaultAsync();
            
            if (telemetry == null)
            {
                _logger.LogInformation("No telemetry data found for vehicle: {VehicleId}", vehicleId);
                return Ok(new { message = "No telemetry data available" });
            }
            
            _logger.LogInformation("Latest telemetry for vehicle {VehicleId}: Battery={Battery}%, Seed={SeedLevel}%", 
                vehicleId, telemetry.Battery, telemetry.SeedLevel);
            return Ok(telemetry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting latest telemetry for vehicle: {VehicleId}", vehicleId);
            return StatusCode(500, new { error = "An error occurred while retrieving telemetry data" });
        }
    }

    // GET: api/telemetry/history
    [HttpGet("history")]
    public async Task<IActionResult> GetTelemetryHistory(
        [FromQuery] string vehicleId = "unknown",
        [FromQuery] int limit = 50)
    {
        try
        {
            // ✅ Validation
            if (limit < 1 || limit > 100)
            {
                _logger.LogWarning("Invalid limit: {Limit}", limit);
                return BadRequest(new { error = "Limit must be between 1 and 100" });
            }

            _logger.LogInformation("Getting telemetry history for vehicle: {VehicleId}, limit: {Limit}", vehicleId, limit);

            var telemetries = await _dbContext.Telemetries
                .Where(t => t.VehicleId == vehicleId)
                .OrderByDescending(t => t.Timestamp)
                .Take(limit)
                .ToListAsync();
            
            _logger.LogInformation("Retrieved {Count} telemetry records for vehicle: {VehicleId}", telemetries.Count, vehicleId);
            return Ok(telemetries);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting telemetry history for vehicle: {VehicleId}", vehicleId);
            return StatusCode(500, new { error = "An error occurred while retrieving telemetry history" });
        }
    }

    // GET: api/telemetry/statistics
    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics([FromQuery] string vehicleId = "unknown")
    {
        try
        {
            _logger.LogInformation("Getting statistics for vehicle: {VehicleId}", vehicleId);

            var today = DateTime.Today;
            
            var stats = new
            {
                totalTelemetry = await _dbContext.Telemetries
                    .CountAsync(t => t.VehicleId == vehicleId),
                
                todayTelemetry = await _dbContext.Telemetries
                    .CountAsync(t => t.VehicleId == vehicleId && t.Timestamp >= today),
                
                latestBattery = await _dbContext.Telemetries
                    .Where(t => t.VehicleId == vehicleId)
                    .OrderByDescending(t => t.Timestamp)
                    .Select(t => t.Battery)
                    .FirstOrDefaultAsync(),
                
                latestSeedLevel = await _dbContext.Telemetries
                    .Where(t => t.VehicleId == vehicleId)
                    .OrderByDescending(t => t.Timestamp)
                    .Select(t => t.SeedLevel)
                    .FirstOrDefaultAsync(),
                
                latestAreaCovered = await _dbContext.Telemetries
                    .Where(t => t.VehicleId == vehicleId)
                    .OrderByDescending(t => t.Timestamp)
                    .Select(t => t.AreaCovered)
                    .FirstOrDefaultAsync()
            };
            
            _logger.LogInformation("Statistics retrieved for vehicle: {VehicleId}", vehicleId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statistics for vehicle: {VehicleId}", vehicleId);
            return StatusCode(500, new { error = "An error occurred while retrieving statistics" });
        }
    }
}