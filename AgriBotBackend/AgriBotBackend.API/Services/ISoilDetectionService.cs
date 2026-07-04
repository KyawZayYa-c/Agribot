using AgriBotBackend.API.Data;  // ✅ ဒါကို ထည့်ပါ
using AgriBotBackend.API.Models;

namespace AgriBotBackend.API.Services;

public interface ISoilDetectionService
{
    Task<SoilDetectionResponse> DetectSoilAsync(SoilDetectionRequest request);
    Task<List<SoilInfo>> GetAllSoilTypesAsync();  // ✅ SoilInfo ကို သုံးထားတယ်
}