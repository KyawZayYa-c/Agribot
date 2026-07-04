// ==========================================
// ဥပမာ - Component ထဲမှာ သုံးပုံ
// ==========================================

// 1. Connection Status ကို စစ်မယ်
const checkConnection = async () => {
    try {
        const status = await getConnectionStatus();
        if (status.isConnected) {
            console.log('✅ ESP32 Connected!');
        } else {
            console.log('❌ ESP32 Disconnected');
        }
    } catch (error) {
        console.error('Error checking connection:', error);
    }
};

// 2. Command ပို့မယ်
const handleForward = async () => {
    try {
        await sendCommand('forward', '50');
        console.log('✅ Forward command sent!');
    } catch (error) {
        console.error('Error sending command:', error);
    }
};

// 3. Telemetry Data ရယူမယ်
const loadTelemetry = async () => {
    try {
        const data = await getLatestTelemetry('agribot-001');
        console.log('📊 Battery:', data.battery);
        console.log('🌾 Seed Level:', data.seedLevel);
    } catch (error) {
        console.error('Error loading telemetry:', error);
    }
};