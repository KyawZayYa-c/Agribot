// ==========================================
// API Service - Backend 
// ==========================================

import { API_BASE_URL, API_ENDPOINTS } from '../constants/apiConfig';

// ==========================================
// Helper Function - Error Handling
// ==========================================
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

const handleError = (error) => {
  console.error('❌ API Error:', error.message);
  throw error;
};

// ==========================================
// 1. AI Chat APIs
// ==========================================

/**
 * Send message to AI Chat
 * @param {string} message - User's message
 * @param {string} feature - Feature type (crop, disease, pest, fertilizer, farming, weather, general)
 * @returns {Promise<{reply: string, feature: string, timestamp: string}>}
 * 
 * Example:
 * sendAIMessage('စပါးအရွက်ဝါနေတယ်', 'disease')
 */
export const sendAIMessage = async (message, feature = 'general') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI_CHAT_MESSAGE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, feature }),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { 
      reply: 'ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားပါ။', 
      feature: 'general' 
    };
  }
};

/**
 * Get available AI features
 * @returns {Promise<Array<{id: string, label: string, icon: string}>>}
 * 
 * Example:
 * getAIFeatures()
 */
export const getAIFeatures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI_CHAT_FEATURES}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return [];
  }
};

// ==========================================
// 2. Status APIs
// ==========================================

/**
 * Get connection status
 * @returns {Promise<{isConnected: boolean, status: string, timestamp: string}>}
 */
export const getConnectionStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CONNECTION_STATUS}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { isConnected: false, status: 'Disconnected' };
  }
};

// ==========================================
// 3. Vehicle APIs
// ==========================================

/**
 * Get all vehicles
 * @returns {Promise<Array>}
 */
export const getVehicles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return [];
  }
};

// ==========================================
// 4. Telemetry APIs
// ==========================================

/**
 * Get latest telemetry data
 * @param {string} vehicleId - Vehicle ID (default: 'unknown')
 * @returns {Promise<Object>}
 */
export const getLatestTelemetry = async (vehicleId = 'unknown') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TELEMETRY_LATEST}?vehicleId=${vehicleId}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return null;
  }
};

/**
 * Get telemetry history
 * @param {string} vehicleId - Vehicle ID
 * @param {number} limit - Number of records (default: 50)
 * @returns {Promise<Array>}
 */
export const getTelemetryHistory = async (vehicleId = 'unknown', limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TELEMETRY_HISTORY}?vehicleId=${vehicleId}&limit=${limit}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return [];
  }
};

/**
 * Get telemetry statistics
 * @param {string} vehicleId - Vehicle ID
 * @returns {Promise<Object>}
 */
export const getTelemetryStatistics = async (vehicleId = 'unknown') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TELEMETRY_STATISTICS}?vehicleId=${vehicleId}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return null;
  }
};

// ==========================================
// 5. Commands APIs
// ==========================================

/**
 * Get command history
 * @param {string} vehicleId - Vehicle ID
 * @param {number} limit - Number of records (default: 50)
 * @returns {Promise<Array>}
 */
export const getCommandHistory = async (vehicleId = 'unknown', limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COMMANDS_HISTORY}?vehicleId=${vehicleId}&limit=${limit}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return [];
  }
};

/**
 * Get latest command
 * @param {string} vehicleId - Vehicle ID
 * @returns {Promise<Object>}
 */
export const getLatestCommand = async (vehicleId = 'unknown') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COMMANDS_LATEST}?vehicleId=${vehicleId}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return null;
  }
};

// ==========================================
// 6. Send Command (ESP32 Control)
// ==========================================

/**
 * Send command to ESP32
 * @param {string} command - Command type (forward, backward, left, right, stop)
 * @param {string} value - Command value (speed, etc.)
 * @returns {Promise<{message: string}>}
 * 
 * Example:
 * sendCommand('forward', '50')
 */
export const sendCommand = async (command, value) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command, value }),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { message: 'Failed to send command' };
  }
};

// ==========================================
// 7. Soil Detection APIs
// ==========================================

/**
 * Get all soil types
 * @returns {Promise<Array>}
 */
export const getSoilTypes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/soil/types`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return [];
  }
};

/**
 * Detect soil from image or manual selection
 * @param {string} soilType - Manual soil type (clay, sandy, loamy)
 * @param {string} imageBase64 - Base64 image (optional)
 * @returns {Promise<{soilType: string, soilName: string, description: string, crops: string[], audioUrl: string}>}
 */
export const detectSoil = async (soilType = null, imageBase64 = null) => {
  try {
    const body = {};
    if (soilType) {
      body.soilType = soilType;
    }
    if (imageBase64) {
      body.imageBase64 = imageBase64;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/soil/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return null;
  }
};

// ==========================================
// 8. Camera APIs (ထပ်ထည့်ပါ)
// ==========================================

/**
 * Send camera control command to ESP32
 * @param {string} direction - 'up', 'down', 'left', 'right', 'stop'
 * @param {string} vehicleId - Vehicle ID (default: 'esp32-test-001')
 * @returns {Promise<{success: boolean, message: string}>}
 * 
 * Example:
 * sendCameraCommand('up', 'esp32-test-001')
 */
export const sendCameraCommand = async (direction, vehicleId = 'esp32-test-001') => {
  try {
    const commandMap = {
      up: 'camera_up',
      down: 'camera_down',
      left: 'camera_left',
      right: 'camera_right',
      stop: 'camera_stop'
    };
    
    const command = commandMap[direction] || 'camera_stop';
    const value = direction === 'stop' ? '0' : '30';
    
    const response = await fetch(`${API_BASE_URL}/api/status/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        command: command, 
        value: value,
        vehicleId: vehicleId
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { success: false, error: error.message };
  }
};

/**
 * Get camera stream URL
 * @param {string} vehicleId - Vehicle ID (default: 'esp32-test-001')
 * @returns {Promise<{streamUrl: string, vehicleId: string, cameraIp: string, cameraPort: number, status: string}>}
 * 
 * Example:
 * getCameraStreamUrl()
 */
export const getCameraStreamUrl = async (vehicleId = 'esp32-test-001') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMERA_STREAM}?vehicleId=${vehicleId}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { streamUrl: 'http://10.53.54.30:81/stream' };
  }
};

/**
 * Send capture command to ESP32
 * @param {string} vehicleId - Vehicle ID (default: 'esp32-test-001')
 * @returns {Promise<{success: boolean, message: string, vehicleId: string, timestamp: string}>}
 * 
 * Example:
 * capturePhoto()
 */
export const capturePhoto = async (vehicleId = 'esp32-test-001') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMERA_CAPTURE}?vehicleId=${vehicleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { success: false, error: error.message };
  }
};

/**
 * Send photo to server (ESP32 ကနေ ခေါ်မယ်)
 * @param {string} vehicleId - Vehicle ID
 * @param {string} imageBase64 - Base64 encoded image
 * @param {string} format - Image format (default: 'jpeg')
 * @returns {Promise<{success: boolean, message: string, path: string, vehicleId: string}>}
 * 
 * Example:
 * uploadPhoto('esp32-test-001', 'base64data...')
 */
export const uploadPhoto = async (vehicleId, imageBase64, format = 'jpeg') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMERA_PHOTO}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId: vehicleId,
        data: imageBase64,
        format: format,
        timestamp: new Date().toISOString()
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { success: false, error: error.message };
  }
};

/**
 * Get latest photo
 * @param {string} vehicleId - Vehicle ID (default: 'esp32-test-001')
 * @returns {Promise<{success: boolean, path: string, url: string, vehicleId: string, timestamp: string}>}
 * 
 * Example:
 * getLatestPhoto()
 */
export const getLatestPhoto = async (vehicleId = 'esp32-test-001') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMERA_LATEST}?vehicleId=${vehicleId}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { success: false, error: error.message };
  }
};

/**
 * Get camera status
 * @param {string} vehicleId - Vehicle ID (default: 'esp32-test-001')
 * @returns {Promise<{vehicleId: string, isConnected: boolean, status: string, timestamp: string}>}
 * 
 * Example:
 * getCameraStatus()
 */
export const getCameraStatus = async (vehicleId = 'esp32-test-001') => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMERA_STATUS}?vehicleId=${vehicleId}`);
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { isConnected: false, status: 'Offline' };
  }
};

/**
 * Update camera IP address
 * @param {string} vehicleId - Vehicle ID
 * @param {string} cameraIp - New camera IP
 * @param {number} cameraPort - Camera port (default: 81)
 * @returns {Promise<{message: string, streamUrl: string}>}
 * 
 * Example:
 * updateCameraIp('esp32-test-001', '192.168.1.200', 81)
 */
export const updateCameraIp = async (vehicleId, cameraIp, cameraPort = 81) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CAMERA_UPDATE_IP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId: vehicleId,
        cameraIp: cameraIp,
        cameraPort: cameraPort
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    return { error: error.message };
  }
};