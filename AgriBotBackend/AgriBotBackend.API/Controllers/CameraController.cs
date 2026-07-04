using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.Core.Models;
using AgriBotBackend.API.Models;
using AgriBotBackend.API.Services;
using System.Text.Json;

namespace AgriBotBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CameraController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IWebSocketService _webSocketService;
    private readonly IPhotoStorageService _photoStorageService;
    private readonly ILogger<CameraController> _logger;

    public CameraController(
        AppDbContext dbContext,
        IWebSocketService webSocketService,
        IPhotoStorageService photoStorageService,
        ILogger<CameraController> logger)
    {
        _dbContext = dbContext;
        _webSocketService = webSocketService;
        _photoStorageService = photoStorageService;
        _logger = logger;
    }

    // ==========================================
    // GET: api/camera/stream
    // ==========================================
    [HttpGet("stream")]
    public async Task<IActionResult> GetCameraStreamUrl([FromQuery] string vehicleId = "esp32-test-001")
    {
        var vehicle = await _dbContext.Vehicles
            .FirstOrDefaultAsync(v => v.VehicleId == vehicleId);

        if (vehicle == null)
        {
            return Ok(new
            {
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

    // ==========================================
    // POST: api/camera/update-ip
    // ==========================================
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

        return Ok(new
        {
            message = "Camera IP updated successfully",
            streamUrl = $"http://{request.CameraIp}:{request.CameraPort}/stream"
        });
    }

    // ==========================================
    // POST: api/camera/capture
    // ==========================================
    [HttpPost("capture")]
    public async Task<IActionResult> CapturePhoto([FromQuery] string vehicleId = "esp32-test-001")
    {
        try
        {
            _logger.LogInformation($"📸 Capture command received for vehicle: {vehicleId}");

            var vehicle = await _dbContext.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleId == vehicleId);

            if (vehicle == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = "Vehicle not found"
                });
            }

            if (!_webSocketService.IsConnected())
            {
                return StatusCode(503, new
                {
                    success = false,
                    error = "ESP32 is not connected"
                });
            }

            var command = new
            {
                command = "capture",
                value = "1",
                vehicleId = vehicleId,
                timestamp = DateTime.Now
            };

            var message = JsonSerializer.Serialize(command);
            await _webSocketService.SendToVehicleAsync(message);

            _logger.LogInformation($"✅ Capture command sent to vehicle: {vehicleId}");

            return Ok(new
            {
                success = true,
                message = "Capture command sent to ESP32",
                vehicleId = vehicleId,
                timestamp = DateTime.Now
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send capture command");
            return StatusCode(500, new
            {
                success = false,
                error = "Failed to send capture command",
                details = ex.Message
            });
        }
    }

    // ==========================================
    // POST: api/camera/photo (ESP32 ကနေ Photo လက်ခံမယ်)
    // ==========================================
    [HttpPost("photo")]
    public async Task<IActionResult> ReceivePhoto([FromBody] PhotoRequest request)
    {
        try
        {
            _logger.LogInformation($"📸 Photo received from vehicle: {request.VehicleId}, Size: {request.Data?.Length ?? 0} bytes");

            if (string.IsNullOrEmpty(request.Data))
            {
                return BadRequest(new
                {
                    success = false,
                    error = "Photo data is empty"
                });
            }

            // Photo ကို Folder မှာ သိမ်းပါ
            var filePath = await _photoStorageService.SavePhotoAsync(
                request.VehicleId,
                request.Data,
                request.Format
            );

            _logger.LogInformation($"✅ Photo saved: {filePath}");

            return Ok(new
            {
                success = true,
                message = "Photo received and saved successfully",
                path = filePath,
                vehicleId = request.VehicleId,
                timestamp = DateTime.Now
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to receive photo");
            return StatusCode(500, new
            {
                success = false,
                error = "Failed to receive photo",
                details = ex.Message
            });
        }
    }

    // ==========================================
    // GET: api/camera/latest
    // ==========================================
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestPhoto([FromQuery] string vehicleId = "esp32-test-001")
    {
        try
        {
            var photoPath = await _photoStorageService.GetLatestPhotoPathAsync(vehicleId);

            if (photoPath == null)
            {
                return Ok(new
                {
                    success = true,
                    message = "No photos found",
                    vehicleId = vehicleId,
                    timestamp = DateTime.Now
                });
            }

            // Full URL ကို ပြန်ပို့ပါ
            var fullUrl = $"{Request.Scheme}://{Request.Host}{photoPath}";

            return Ok(new
            {
                success = true,
                path = photoPath,
                url = fullUrl,
                vehicleId = vehicleId,
                timestamp = DateTime.Now
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get latest photo");
            return StatusCode(500, new
            {
                success = false,
                error = "Failed to get latest photo"
            });
        }
    }

    // ==========================================
    // GET: api/camera/status
    // ==========================================
    [HttpGet("status")]
    public IActionResult GetCameraStatus([FromQuery] string vehicleId = "esp32-test-001")
    {
        var isConnected = _webSocketService.IsConnected();

        return Ok(new
        {
            vehicleId = vehicleId,
            isConnected = isConnected,
            status = isConnected ? "Online" : "Offline",
            timestamp = DateTime.Now
        });
    }
}