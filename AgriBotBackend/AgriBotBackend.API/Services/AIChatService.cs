using System.Text;
using System.Text.Json;
using AgriBotBackend.API.Models;

namespace AgriBotBackend.API.Services;

public class AIChatService : IAIChatService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIChatService> _logger;
    private readonly string _geminiApiKey;
    private const string GeminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public AIChatService(ILogger<AIChatService> logger)
    {
        _logger = logger;
        _httpClient = new HttpClient();
        _httpClient.Timeout = TimeSpan.FromSeconds(60);  
        _geminiApiKey = "";
    }

    public async Task<ChatResponse> SendMessageAsync(ChatRequest request)
    {
        try
        {
            _logger.LogInformation($"Processing AI chat request: {request.Message}");

            // ✅ စာကြောင်းရှည်ဖြေဖို့ ညွှန်ပါ
            var prompt = $@"ကျေးဇူးပြု၍ အသေးစိတ်ကျကျ၊ ရှည်လျားစွာ ဖြေကြားပေးပါ။ အဆင့်ဆင့် ရှင်းပြပါ။ အားလုံးကို အပြည့်အစုံ ဖြေပါ။

{request.Message}";

            var geminiRequest = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                system_instruction = new
                {
                    parts = new[]
                    {
                        new { text = @"You are Agri-AI Assistant. Provide detailed, helpful, and practical agricultural advice in Burmese language.

IMPORTANT RULES:
1. Provide COMPLETE and THOROUGH answers
2. NEVER cut off mid-sentence
3. Give step-by-step guidance with clear explanations
4. Include causes, solutions, prevention methods, and practical tips
5. Answer in LONG, COMPLETE paragraphs
6. Be specific and detailed

If the user asks about fertilizers, explain:
- What type of fertilizer to use
- When to apply
- How much to apply
- How to apply
- Precautions

If the user asks about diseases, explain:
- What disease it might be
- Causes
- Prevention methods
- Treatment methods
- When to take action" }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.5,
                    maxOutputTokens = 8192,  // ✅ 8192 တိုးပါ
                    topP = 0.95,
                    topK = 40
                }
            };

            var json = JsonSerializer.Serialize(geminiRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(
                $"{GeminiUrl}?key={_geminiApiKey}",
                content
            );

            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"❌ Gemini API Error: {responseJson}");
                return new ChatResponse
                {
                    Reply = $"Gemini API Error: {response.StatusCode}",
                    Feature = "general"
                };
            }

            var geminiResponse = JsonDocument.Parse(responseJson);
            var candidates = geminiResponse.RootElement.GetProperty("candidates");
            
            if (candidates.GetArrayLength() == 0)
            {
                return new ChatResponse
                {
                    Reply = "No response from AI.",
                    Feature = "general"
                };
            }

            var reply = candidates[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

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