using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.Core.Models;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using AgriBotBackend.API.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AgriBotBackend.API.Services;

public class WebSocketService : IWebSocketService
{
    private WebSocket? _webSocket;
    private bool _isConnected = false;
    private string? _vehicleId = null;
    private string? _esp32Ip = null; 
    private readonly ILogger<WebSocketService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<AgriBotHub> _hubContext;

    public WebSocketService(
        ILogger<WebSocketService> logger,
        IServiceScopeFactory scopeFactory,
        IHubContext<AgriBotHub> hubContext)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
    }

    public bool IsConnected()
    {
        return _isConnected && _webSocket?.State == WebSocketState.Open;
    }

    public async Task HandleWebSocketConnectionAsync(HttpContext context)
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            try
            {
                _webSocket = await context.WebSockets.AcceptWebSocketAsync();
                _isConnected = true;

                // ✅ ESP32 IP ကို သိမ်းပါ
                _esp32Ip = context.Connection.RemoteIpAddress?.ToString();
                if (_esp32Ip != null && _esp32Ip.StartsWith("::ffff:"))
                {
                    _esp32Ip = _esp32Ip.Substring(7);
                }

                _logger.LogInformation("✅ WebSocket connection established!");
                Console.WriteLine($"✅ WebSocket connection established! ESP32 IP: {_esp32Ip}");

                await ReceiveMessagesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"WebSocket error: {ex.Message}");
                Console.WriteLine($"❌ WebSocket error: {ex.Message}");
            }
        }
        else
        {
            context.Response.StatusCode = 400;
            Console.WriteLine("❌ Not a WebSocket request");
        }
    }
    private async Task ReceiveMessagesAsync()
    {
        var buffer = new byte[1024 * 4];

        while (_webSocket?.State == WebSocketState.Open)
        {
            try
            {
                var result = await _webSocket.ReceiveAsync(
                    new ArraySegment<byte>(buffer),
                    CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"📨 Received from ESP32: {message}");

                    await ProcessMessageAsync(message);
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    _isConnected = false;
                    Console.WriteLine("❌ WebSocket connection closed by ESP32");
                    await _webSocket.CloseAsync(
                        WebSocketCloseStatus.NormalClosure,
                        "Closed by client",
                        CancellationToken.None);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error receiving message: {ex.Message}");
                Console.WriteLine($"❌ Error receiving message: {ex.Message}");
                break;
            }
        }
    }

    // Database Operation အတွက် Helper
    private async Task<T> ExecuteWithDbContextAsync<T>(Func<AppDbContext, Task<T>> action)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        return await action(dbContext);
    }

    private async Task ExecuteWithDbContextAsync(Func<AppDbContext, Task> action)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await action(dbContext);
    }

    private async Task ProcessMessageAsync(string message)
    {
        try
        {
            var jsonDoc = JsonDocument.Parse(message);
            
            // ==========================================
            // 1. "type" ရှိမရှိ စစ်ဆေးပါ
            // ==========================================
            if (!jsonDoc.RootElement.TryGetProperty("type", out var typeElement))
            {
                // ==========================================
                // 2. Command ဖြစ်ရင် ESP32 ကို တိုက်ရိုက်ပို့ပါ
                // ==========================================
                if (jsonDoc.RootElement.TryGetProperty("command", out var commandElement))
                {
                    var command = commandElement.GetString();
                    var value = jsonDoc.RootElement.TryGetProperty("value", out var valueElement) 
                        ? valueElement.GetString() : "0";
                    
                    Console.WriteLine($"📨 Command received: {command} = {value}");
                    
                    // ✅ Database မသိမ်းဘူး
                    // ✅ ESP32 ကို တိုက်ရိုက်ပို့တယ်
                    var sendMessage = $"{{\"command\":\"{command}\",\"value\":\"{value}\"}}";
                    await SendToVehicleAsync(sendMessage);
                    return;
                }
                
                Console.WriteLine($"📨 Unknown message: {message}");
                return;
            }

            // ==========================================
            // 3. "type" ပါရင် ပုံမှန် Process လုပ်ပါ
            // ==========================================
            var type = typeElement.GetString();

            switch (type)
            {
               
case "register":
    _vehicleId = jsonDoc.RootElement.GetProperty("vehicleId").GetString();
    Console.WriteLine($"🚗 Vehicle registered: {_vehicleId}");
    
    // ✅ _esp32Ip ကို သုံးပါ (context အစား)
    var esp32Ip = _esp32Ip ?? "10.53.54.30";
    
    await ExecuteWithDbContextAsync(async dbContext =>
    {
        var existingVehicle = await dbContext.Vehicles
            .FirstOrDefaultAsync(v => v.VehicleId == _vehicleId);
        
        if (existingVehicle == null)
        {
            var vehicle = new Vehicle
            {
                VehicleId = _vehicleId,
                Name = $"AgriBot-{_vehicleId}",
                Status = "Online",
                Mode = "Manual",
                CameraIp = esp32Ip,
                CameraPort = 81,
                CameraStreamPath = "/stream",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            await dbContext.Vehicles.AddAsync(vehicle);
            await dbContext.SaveChangesAsync();
        }
        else
        {
            existingVehicle.CameraIp = esp32Ip;
            existingVehicle.UpdatedAt = DateTime.Now;
            await dbContext.SaveChangesAsync();
        }
    });
    break;
                case "telemetry":
                    var battery = jsonDoc.RootElement.GetProperty("battery").GetInt32();
                    var seedLevel = jsonDoc.RootElement.GetProperty("seedLevel").GetInt32();
                    var areaCovered = jsonDoc.RootElement.GetProperty("areaCovered").GetDouble();
                    var status = jsonDoc.RootElement.TryGetProperty("status", out var statusElement)
                        ? statusElement.GetString() : "Unknown";
                    
                    Console.WriteLine($"📊 Telemetry: Battery={battery}%, Seed={seedLevel}%, Area={areaCovered}%, Status={status}");
                    
                    // Telemetry Data ကို Database မှာ သိမ်းပါ (ဒါကတော့ သိမ်းထားသင့်တယ်)
                    await ExecuteWithDbContextAsync(async dbContext =>
                    {
                        var telemetry = new Telemetry
                        {
                            VehicleId = _vehicleId ?? "unknown",
                            Battery = battery,
                            SeedLevel = seedLevel,
                            AreaCovered = areaCovered,
                            Status = status,
                            Timestamp = DateTime.Now
                        };
                        await dbContext.Telemetries.AddAsync(telemetry);
                        await dbContext.SaveChangesAsync();
                    });
                    
                    // SignalR ကနေ Frontend ကို Telemetry Data ပြန်ပို့ပါ
                    await _hubContext.Clients.All.SendAsync("ReceiveTelemetry", new
                    {
                        vehicleId = _vehicleId,
                        battery = battery,
                        seedLevel = seedLevel,
                        areaCovered = areaCovered,
                        status = status,
                        timestamp = DateTime.Now
                    });
                    break;

                default:
                    Console.WriteLine($"📨 Unknown message type: {type}");
                    break;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error processing message: {ex.Message}");
            Console.WriteLine($"   Message: {message}");
        }
    }

    public async Task SendToVehicleAsync(string message)
    {
        if (_webSocket?.State == WebSocketState.Open)
        {
            try
            {
                var bytes = Encoding.UTF8.GetBytes(message);
                await _webSocket.SendAsync(
                    new ArraySegment<byte>(bytes),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None);
                Console.WriteLine($"📤 Sent to ESP32: {message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending message: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine("❌ Cannot send: WebSocket is not connected");
        }
    }
}