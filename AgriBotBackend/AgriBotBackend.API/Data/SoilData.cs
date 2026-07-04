namespace AgriBotBackend.API.Data;

public static class SoilData
{
    public static readonly Dictionary<string, SoilInfo> SoilTypes = new()
    {
        ["clay"] = new SoilInfo
        {
            SoilType = "clay",          // ✅ ထည့်ပါ
            SoilName = "မြေစေး (Clay Soil)",
            Description = "ရေထိန်းနိုင်စွမ်းမြင့်မားပြီး အာဟာရဓာတ်ကြွယ်ဝသော မြေအမျိုးအစားဖြစ်သည်။ စပါးစိုက်ပျိုးရန် အထူးသင့်တော်သည်။",
            Crops = new List<string> { "စပါး", "ပဲတီစိမ်း", "ပဲပုပ်", "နှမ်း", "ကြံ" },
            Icon = "🏔️",
            Color = "#8D6E63",
            AudioFile = "clay_soil.mp3"  // ✅ ထည့်ပါ
        },
        ["sandy"] = new SoilInfo
        {
            SoilType = "sandy",         // ✅ ထည့်ပါ
            SoilName = "မြေသဲ (Sandy Soil)",
            Description = "ရေစီးနိုင်စွမ်းမြင့်မားပြီး အမြစ်များလွယ်ကူစွာ ထိုးဖောက်နိုင်သော မြေအမျိုးအစားဖြစ်သည်။",
            Crops = new List<string> { "မြေပဲ", "နှမ်း", "ပြောင်း", "ဖရုံ", "ခရမ်းချဉ်" },
            Icon = "🏜️",
            Color = "#D7A86E",
            AudioFile = "sandy_soil.mp3" // ✅ ထည့်ပါ
        },
        ["loamy"] = new SoilInfo
        {
            SoilType = "loamy",         // ✅ ထည့်ပါ
            SoilName = "မြေဆွေး (Loamy Soil)",
            Description = "စိုက်ပျိုးရေးအတွက် အကောင်းဆုံးဖြစ်သော မြေအမျိုးအစားဖြစ်ပြီး ရေနှင့်အာဟာရဓာတ် မျှတစွာပါဝင်သည်။",
            Crops = new List<string> { "စပါး", "ပြောင်း", "ဂျုံ", "သီးနှံအမျိုးမျိုး", "ဟင်းသီးဟင်းရွက်" },
            Icon = "🌿",
            Color = "#8D6E63",
            AudioFile = "loamy_soil.mp3" // ✅ ထည့်ပါ
        }
    };
}

public class SoilInfo
{
    public string SoilType { get; set; } = string.Empty;      // ✅ ထည့်ပါ
    public string SoilName { get; set; } = string.Empty;      // ✅ ထည့်ပါ
    public string Description { get; set; } = string.Empty;
    public List<string> Crops { get; set; } = new();
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string AudioFile { get; set; } = string.Empty;     // ✅ ထည့်ပါ
}