using AgriBotBackend.API.Services;

namespace AgriBotBackend.API.Middlewares;

public class WebSocketMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebSocketService _webSocketService;

    public WebSocketMiddleware(RequestDelegate next, IWebSocketService webSocketService)
    {
        _next = next;
        _webSocketService = webSocketService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path == "/ws" && context.WebSockets.IsWebSocketRequest)
        {
            await _webSocketService.HandleWebSocketConnectionAsync(context);
        }
        else
        {
            await _next(context);
        }
    }
}