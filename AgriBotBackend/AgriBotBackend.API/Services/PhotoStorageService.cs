using System.Text;

namespace AgriBotBackend.API.Services;

public class PhotoStorageService : IPhotoStorageService
{
    private readonly ILogger<PhotoStorageService> _logger;
    private readonly string _basePath;

    public PhotoStorageService(ILogger<PhotoStorageService> logger)
    {
        _logger = logger;
        _basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "photos");
        
        // Folder ရှိမရှိ စစ်ပြီး မရှိရင် ဆောက်ပါ
        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
            _logger.LogInformation($"📁 Created photo directory: {_basePath}");
        }
    }

    public async Task<string> SavePhotoAsync(string vehicleId, string base64Data, string format = "jpeg")
    {
        try
        {
            // 1. Base64 Data ကို Clean လုပ်ပါ
            var cleanBase64 = base64Data;
            if (base64Data.Contains(","))
            {
                cleanBase64 = base64Data.Substring(base64Data.IndexOf(",") + 1);
            }

            // 2. Base64 → Byte Array
            var imageBytes = Convert.FromBase64String(cleanBase64);

            // 3. File Name ဆောက်ပါ
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var fileName = $"{vehicleId}_{timestamp}.{format}";
            var filePath = Path.Combine(_basePath, fileName);

            // 4. File ကို Save လုပ်ပါ
            await File.WriteAllBytesAsync(filePath, imageBytes);

            _logger.LogInformation($"📸 Photo saved: {filePath} ({imageBytes.Length} bytes)");

            // 5. Relative Path ကို ပြန်ပို့ပါ
            return $"/photos/{fileName}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save photo");
            throw;
        }
    }

    public async Task<string?> GetLatestPhotoPathAsync(string vehicleId)
    {
        try
        {
            var files = Directory.GetFiles(_basePath, $"{vehicleId}_*.*")
                .OrderByDescending(f => f)
                .ToList();

            if (files.Count == 0)
            {
                return null;
            }

            var latestFile = files.First();
            var relativePath = $"/photos/{Path.GetFileName(latestFile)}";
            
            return await Task.FromResult(relativePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get latest photo");
            return null;
        }
    }
}