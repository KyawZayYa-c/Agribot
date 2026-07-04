using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.Core.Models;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<VehiclesController> _logger;  

    public VehiclesController(AppDbContext dbContext, ILogger<VehiclesController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    // GET: api/vehicles
    [HttpGet]
    public async Task<IActionResult> GetVehicles()
    {
        try
        {
            _logger.LogInformation("Getting all vehicles");

            var vehicles = await _dbContext.Vehicles
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();
            
            _logger.LogInformation("Retrieved {Count} vehicles", vehicles.Count);
            return Ok(vehicles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vehicles");
            return StatusCode(500, new { error = "An error occurred while retrieving vehicles" });
        }
    }

    // GET: api/vehicles/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(string id)
    {
        try
        {
            // ✅ Validation
            if (string.IsNullOrWhiteSpace(id))
            {
                _logger.LogWarning("Empty vehicle ID provided");
                return BadRequest(new { error = "Vehicle ID is required" });
            }

            _logger.LogInformation("Getting vehicle: {VehicleId}", id);

            var vehicle = await _dbContext.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleId == id);
            
            if (vehicle == null)
            {
                _logger.LogWarning("Vehicle not found: {VehicleId}", id);
                return NotFound(new { message = "Vehicle not found" });
            }
            
            _logger.LogInformation("Vehicle found: {VehicleId}, Status: {Status}", id, vehicle.Status);
            return Ok(vehicle);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vehicle: {VehicleId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving vehicle" });
        }
    }
}