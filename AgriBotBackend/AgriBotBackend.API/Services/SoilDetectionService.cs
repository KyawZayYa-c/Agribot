using AgriBotBackend.API.Data;
using AgriBotBackend.API.Models;

namespace AgriBotBackend.API.Services;

public class SoilDetectionService : ISoilDetectionService
{
    private readonly ILogger<SoilDetectionService> _logger;

    public SoilDetectionService(ILogger<SoilDetectionService> logger)
    {
        _logger = logger;
    }

    public async Task<SoilDetectionResponse> DetectSoilAsync(SoilDetectionRequest request)
    {
        try
        {
            string soilType;

            // 1. Manual Selection
            if (!string.IsNullOrEmpty(request.SoilType))
            {
                soilType = request.SoilType.ToLower();
            }
            // 2. Image Detection (Python ကလာမယ်)
            else if (!string.IsNullOrEmpty(request.ImageBase64))
            {
                // TODO: Python API ကိုခေါ်ပြီး Soil Type ကိုရယူမယ်
                // ဒီနေရာမှာ Python Service ကိုခေါ်ဖို့ ပြင်ဆင်ထားပါ
                soilType = await DetectSoilFromImageAsync(request.ImageBase64);
            }
            else
            {
                throw new ArgumentException("SoilType or ImageBase64 is required");
            }

            // 2. Get Soil Data
            if (!SoilData.SoilTypes.TryGetValue(soilType, out var soilInfo))
            {
                throw new KeyNotFoundException($"Soil type '{soilType}' not found");
            }

            // 3. Build Response
            return new SoilDetectionResponse
            {
                SoilType = soilInfo.SoilType,
                SoilName = soilInfo.SoilName,
                Description = soilInfo.Description,
                Icon = soilInfo.Icon,
                Color = soilInfo.Color,
                Crops = soilInfo.Crops,
                Confidence = 0.92,  // Python ကလာရင် ပြောင်းမယ်
                AudioUrl = $"/audio/{soilInfo.AudioFile}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Soil detection failed");
            throw;
        }
    }

    public async Task<List<SoilInfo>> GetAllSoilTypesAsync()
    {
        return await Task.FromResult(SoilData.SoilTypes.Values.ToList());
    }

    // ==========================================
    // Python API ကိုခေါ်မယ့် Function
    // ==========================================
    private async Task<string> DetectSoilFromImageAsync(string imageBase64)
    {
        // TODO: Python Flask/FastAPI ကိုခေါ်ပါ
        // ဥပမာ: 
        // using var client = new HttpClient();
        // var response = await client.PostAsync("http://localhost:5000/predict", content);
        // var result = await response.Content.ReadFromJsonAsync<PythonResponse>();
        // return result.SoilType;

        // Mock Response (Python မရှိသေးရင်)
        await Task.Delay(100);
        return "clay";  // Default
    }
}