using AgriBotBackend.API.Models;

namespace AgriBotBackend.API.Services;

public interface IAIChatService
{
    Task<ChatResponse> SendMessageAsync(ChatRequest request);
}