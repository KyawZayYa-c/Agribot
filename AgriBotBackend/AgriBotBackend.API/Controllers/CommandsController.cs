using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.Core.Models;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommandsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CommandsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/commands/history
    [HttpGet("history")]
    public async Task<IActionResult> GetCommandHistory(
        [FromQuery] string vehicleId = "unknown",
        [FromQuery] int limit = 50)
    {
        var commands = await _dbContext.Commands
            .Where(c => c.VehicleId == vehicleId)
            .OrderByDescending(c => c.Timestamp)
            .Take(limit)
            .ToListAsync();
        
        return Ok(commands);
    }

    // GET: api/commands/latest
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestCommand([FromQuery] string vehicleId = "unknown")
    {
        var command = await _dbContext.Commands
            .Where(c => c.VehicleId == vehicleId)
            .OrderByDescending(c => c.Timestamp)
            .FirstOrDefaultAsync();
        
        if (command == null)
            return Ok(new { message = "No command history available" });
        
        return Ok(command);
    }
}