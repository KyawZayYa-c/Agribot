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

    public TelemetryController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/telemetry/latest
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestTelemetry([FromQuery] string vehicleId = "unknown")
    {
        var telemetry = await _dbContext.Telemetries
            .Where(t => t.VehicleId == vehicleId)
            .OrderByDescending(t => t.Timestamp)
            .FirstOrDefaultAsync();
        
        if (telemetry == null)
            return Ok(new { message = "No telemetry data available" });
        
        return Ok(telemetry);
    }

    // GET: api/telemetry/history
    [HttpGet("history")]
    public async Task<IActionResult> GetTelemetryHistory(
        [FromQuery] string vehicleId = "unknown",
        [FromQuery] int limit = 50)
    {
        var telemetries = await _dbContext.Telemetries
            .Where(t => t.VehicleId == vehicleId)
            .OrderByDescending(t => t.Timestamp)
            .Take(limit)
            .ToListAsync();
        
        return Ok(telemetries);
    }

    // GET: api/telemetry/statistics
    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics([FromQuery] string vehicleId = "unknown")
    {
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
                .FirstOrDefaultAsync()
        };
        
        return Ok(stats);
    }
}