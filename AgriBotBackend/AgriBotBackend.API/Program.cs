using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.API.Middlewares;
using AgriBotBackend.API.Services;
using AgriBotBackend.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddScoped<IAIChatService, AIChatService>();
builder.Services.AddScoped<ISoilDetectionService, SoilDetectionService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=agribot.db"));

// SignalR
builder.Services.AddSignalR();

// WebSocket Service
builder.Services.AddSingleton<IWebSocketService, WebSocketService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// ✅ Port - External Access အတွက်
app.Urls.Clear();
app.Urls.Add("http://0.0.0.0:5233");

// Global Exception Handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new
        {
            error = "An unexpected error occurred",
            timestamp = DateTime.Now
        }));
    });
});

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseWebSockets();
app.UseMiddleware<WebSocketMiddleware>();
app.MapControllers();
app.MapHub<AgriBotHub>("/agribotHub");

Console.WriteLine("========================================");
Console.WriteLine("🚀 AgriBot Server is running!");
Console.WriteLine("========================================");
Console.WriteLine($"📍 WebSocket endpoint: ws://localhost:5233/ws");
Console.WriteLine($"📍 SignalR Hub: http://localhost:5233/agribotHub");
Console.WriteLine($"📍 API endpoint: http://localhost:5233/api/status/connection");
Console.WriteLine($"📍 CORS: All origins allowed");
Console.WriteLine("========================================");

app.Run();