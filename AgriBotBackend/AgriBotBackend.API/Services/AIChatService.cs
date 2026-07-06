using System.Text;
using System.Text.Json;
using AgriBotBackend.API.Models;

namespace AgriBotBackend.API.Services;

public class AIChatService : IAIChatService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIChatService> _logger;
    
    private const string ProxyUrl = "https://gemini-proxy-server-0ekj.onrender.com/api/gemini-proxy";

    public AIChatService(ILogger<AIChatService> logger)
    {
        _logger = logger;
        _httpClient = new HttpClient();
        _httpClient.Timeout = TimeSpan.FromSeconds(60);
    }

    public async Task<ChatResponse> SendMessageAsync(ChatRequest request)
    {
        try
        {
            _logger.LogInformation($"Processing AI chat request: {request.Message}");

            // ✅ Proxy ကို message နဲ့ပို့ပါ
            var proxyRequest = new
            {
                message = request.Message  // ← message နဲ့ပို့ပါ
            };

            var json = JsonSerializer.Serialize(proxyRequest);
            
            Console.WriteLine($"📤 Sending: {json}");
            
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(ProxyUrl, content);
            var responseJson = await response.Content.ReadAsStringAsync();
            
            Console.WriteLine($"📥 Response: {responseJson}");

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"❌ Proxy API Error: {responseJson}");
                return new ChatResponse
                {
                    Reply = $"Proxy API Error: {response.StatusCode}",
                    Feature = "general"
                };
            }

            var result = JsonDocument.Parse(responseJson);
            var reply = result.RootElement.GetProperty("reply").GetString();

            return new ChatResponse
            {
                Reply = reply ?? "မဖြေနိုင်ပါ။",
                Feature = request.Feature ?? "general"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in AI Chat Service");
            Console.WriteLine($"❌ Error: {ex.Message}");
            return new ChatResponse
            {
                Reply = "ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားပါ။",
                Feature = "general"
            };
        }
    }
}