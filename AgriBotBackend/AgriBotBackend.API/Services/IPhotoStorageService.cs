namespace AgriBotBackend.API.Services;

public interface IPhotoStorageService
{
    Task<string> SavePhotoAsync(string vehicleId, string base64Data, string format = "jpeg");
    Task<string?> GetLatestPhotoPathAsync(string vehicleId);
}