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

    public VehiclesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/vehicles
    [HttpGet]
    public async Task<IActionResult> GetVehicles()
    {
        var vehicles = await _dbContext.Vehicles
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
        
        return Ok(vehicles);
    }

    // GET: api/vehicles/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(string id)
    {
        var vehicle = await _dbContext.Vehicles
            .FirstOrDefaultAsync(v => v.VehicleId == id);
        
        if (vehicle == null)
            return NotFound(new { message = "Vehicle not found" });
        
        return Ok(vehicle);
    }
}