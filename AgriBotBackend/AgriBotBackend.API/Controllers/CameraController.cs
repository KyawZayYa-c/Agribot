using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.Core.Models;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CameraController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CameraController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/camera/stream?vehicleId=esp32-test-001
    [HttpGet("stream")]
    public async Task<IActionResult> GetCameraStreamUrl([FromQuery] string vehicleId = "esp32-test-001")
    {
        var vehicle = await _dbContext.Vehicles
            .FirstOrDefaultAsync(v => v.VehicleId == vehicleId);

        if (vehicle == null)
        {
            return Ok(new { 
                streamUrl = "http://10.53.54.30:81/stream",
                message = "Using default IP. Vehicle not found." 
            });
        }

        var streamUrl = $"http://{vehicle.CameraIp}:{vehicle.CameraPort}{vehicle.CameraStreamPath}";
        
        return Ok(new
        {
            streamUrl = streamUrl,
            vehicleId = vehicle.VehicleId,
            cameraIp = vehicle.CameraIp,
            cameraPort = vehicle.CameraPort,
            status = vehicle.Status
        });
    }

    // POST: api/camera/update-ip
    [HttpPost("update-ip")]
    public async Task<IActionResult> UpdateCameraIp([FromBody] UpdateCameraIpRequest request)
    {
        var vehicle = await _dbContext.Vehicles
            .FirstOrDefaultAsync(v => v.VehicleId == request.VehicleId);

        if (vehicle == null)
        {
            return NotFound(new { message = "Vehicle not found" });
        }

        vehicle.CameraIp = request.CameraIp;
        vehicle.CameraPort = request.CameraPort;
        vehicle.UpdatedAt = DateTime.Now;

        await _dbContext.SaveChangesAsync();

        return Ok(new { 
            message = "Camera IP updated successfully",
            streamUrl = $"http://{request.CameraIp}:{request.CameraPort}/stream"
        });
    }
}

public class UpdateCameraIpRequest
{
    public string VehicleId { get; set; } = string.Empty;
    public string CameraIp { get; set; } = string.Empty;
    public int CameraPort { get; set; } = 81;
}