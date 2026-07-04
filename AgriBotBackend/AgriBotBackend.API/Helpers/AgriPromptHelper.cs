namespace AgriBotBackend.API.Helpers;

public static class AgriPromptHelper
{
    private const string SystemInstruction = @"
You are Agri-AI Assistant, a helpful agricultural expert for Myanmar farmers.
Your job is to help farmers with crop recommendations, disease detection, pest control, fertilizer advice, and general farming knowledge.

IMPORTANT RULES:
1. ALWAYS respond in Myanmar language (Burmese) ONLY
2. Keep responses clear, simple, and practical
3. Provide step-by-step guidance when needed
4. Include warnings and precautions when relevant
5. If you don't know, say ""I don't know"" instead of guessing
6. Use friendly and respectful tone
7. For crop recommendations, ask for location, soil type, and season if not provided
";

    public static string GetSystemInstruction() => SystemInstruction;

    public static string GetCropRecommendationPrompt(string userQuery, string? location, string? soilType, string? season)
    {
        return $@"
You are an agricultural expert. User is asking for crop recommendation.

User Query: ""{userQuery}""
Location: {location ?? "Not specified (သတ်မှတ်မထားပါ)"}
Soil Type: {soilType ?? "Not specified (သတ်မှတ်မထားပါ)"}
Season: {season ?? "Not specified (သတ်မှတ်မထားပါ)"}

Please provide a detailed crop recommendation in Burmese language with:
1. အကြံပြုသီးနှံ (Recommended crops)
2. ဘာကြောင့် သင့်တော်လဲ (Why suitable)
3. စိုက်ပျိုးချိန် (Planting time)
4. ရိတ်သိမ်းချိန် (Harvest time)
5. အကြံပြုချက်များ (Additional tips)
";
    }

    public static string GetDiseaseDetectionPrompt(string userQuery)
    {
        return $@"
You are a plant disease expert. User is describing crop symptoms.

User Query: ""{userQuery}""

Please provide detailed disease analysis in Burmese language with:
1. ဖြစ်နိုင်တဲ့ရောဂါ (Possible diseases)
2. ဖြစ်ရတဲ့အကြောင်းရင်း (Causes)
3. ကာကွယ်နည်း (Prevention)
4. ကုသနည်း (Treatment)
5. သတိထားရမယ့်အချက် (Precautions)
";
    }

    public static string GetPestControlPrompt(string userQuery)
    {
        return $@"
You are a pest control expert. User is reporting pest problems.

User Query: ""{userQuery}""

Please provide pest control advice in Burmese language with:
1. ပိုးအမျိုးအစား (Pest type)
2. ဘယ်လိုဖျက်ဆီးလဲ (Damage description)
3. အော်ဂဲနစ်နည်းလမ်း (Organic solution)
4. ဓာတုနည်းလမ်း (Chemical solution)
5. ဘယ်အချိန်ဖျန်းရမလဲ (Application timing)
";
    }

    public static string GetFertilizerPrompt(string userQuery)
    {
        return $@"
You are a fertilizer expert. User is asking about fertilizer.

User Query: ""{userQuery}""

Please provide fertilizer advice in Burmese language with:
1. ဓာတ်မြေဩဇာအမည် (Fertilizer name)
2. အသုံးပြုချိန် (Application timing)
3. အသုံးပြုနှုန်း (Application rate)
4. သတိပြုရန် (Precautions)
";
    }

    public static string GetFarmingGuidePrompt(string userQuery)
    {
        return $@"
You are a farming guide expert. User is asking for step-by-step farming guide.

User Query: ""{userQuery}""

Please provide a step-by-step farming guide in Burmese language with:
1. အဆင့် ၁: မြေပြင်ဆင်ခြင်း (Land preparation)
2. အဆင့် ၂: မျိုးစေ့ရွေးချယ်ခြင်း (Seed selection)
3. အဆင့် ၃: စိုက်ပျိုးခြင်း (Planting)
4. အဆင့် ၄: ရေလောင်းခြင်း (Watering)
5. အဆင့် ၅: မြေဩဇာကျွေးခြင်း (Fertilizing)
6. အဆင့် ၆: ရိတ်သိမ်းခြင်း (Harvesting)
";
    }

    public static string GetGeneralPrompt(string userQuery)
    {
        return $@"
You are Agri-AI Assistant. Answer the following farming question in Burmese language:

User Query: ""{userQuery}""

Provide a clear, helpful, and practical response. Include examples if relevant.
";
    }

    public static string DetectFeature(string message)
    {
        var lower = message.ToLower();
        
        if (lower.Contains("ဘာစိုက်") || lower.Contains("ဘာသီးနှံ") || lower.Contains("စိုက်ရ") || lower.Contains("crop"))
            return "crop";
        if (lower.Contains("အရွက်") || lower.Contains("ရောဂါ") || lower.Contains("အဝါ") || lower.Contains("အညို") || lower.Contains("disease"))
            return "disease";
        if (lower.Contains("ပိုး") || lower.Contains("pest") || lower.Contains("သတ်ဆေး") || lower.Contains("ဖျက်ပိုး"))
            return "pest";
        if (lower.Contains("မြေဩဇာ") || lower.Contains("ဓာတ်") || lower.Contains("fertilizer") || lower.Contains("ဩဇာ"))
            return "fertilizer";
        if (lower.Contains("ဘယ်လိုစိုက်") || lower.Contains("စိုက်နည်း") || lower.Contains("farming guide"))
            return "farming";
        if (lower.Contains("မိုး") || lower.Contains("weather") || lower.Contains("ရာသီဥတု") || lower.Contains("လေ"))
            return "weather";
        
        return "general";
    }

    public static string GetPromptByFeature(string feature, string message, string? location, string? soilType, string? season)
    {
        return feature switch
        {
            "crop" => GetCropRecommendationPrompt(message, location, soilType, season),
            "disease" => GetDiseaseDetectionPrompt(message),
            "pest" => GetPestControlPrompt(message),
            "fertilizer" => GetFertilizerPrompt(message),
            "farming" => GetFarmingGuidePrompt(message),
            _ => GetGeneralPrompt(message)
        };
    }
}