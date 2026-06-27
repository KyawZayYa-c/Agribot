using Microsoft.EntityFrameworkCore;
using AgriBotBackend.Infrastructure.Data;
using AgriBotBackend.API.Middlewares;
using AgriBotBackend.API.Services;
using AgriBotBackend.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=agribot.db"));

// SignalR
builder.Services.AddSignalR();

// ✅ WebSocket Service - Singleton ပြန်ပြောင်းပါ
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

// Configure the HTTP request pipeline
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

// SignalR Hub
app.MapHub<AgriBotHub>("/agribotHub");

// Port
app.Urls.Clear();
app.Urls.Add("http://localhost:5233");

Console.WriteLine("========================================");
Console.WriteLine("🚀 AgriBot Server is running!");
Console.WriteLine("========================================");
Console.WriteLine($"📍 WebSocket endpoint: ws://localhost:5233/ws");
Console.WriteLine($"📍 SignalR Hub: http://localhost:5233/agribotHub");
Console.WriteLine($"📍 API endpoint: http://localhost:5233/api/status/connection");
Console.WriteLine($"📍 CORS: All origins allowed");
Console.WriteLine("========================================");

app.Run();