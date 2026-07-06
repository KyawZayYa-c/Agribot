// hooks/useCamera.js
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { sendCameraCommand, getConnectionStatus } from '../services/apiService';

export const useCamera = (esp32Ip = '10.53.54.30') => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const videoStreamUrl = `http://${esp32Ip}:81/stream`;
  const checkIntervalRef = useRef(null);

  // ✅ API_URL ကို မှန်ကန်အောင်သတ်မှတ်ပါ
  const API_URL = 'http://10.53.54.172:5233/api/status/connection';

  const checkConnectionAndLoadVideo = async () => {
    try {
      setIsVideoLoading(true);
      setVideoError(false);
      
      console.log('🔍 Checking connection at:', API_URL);
      
      // ✅ getConnectionStatus ကိုသုံးပါ
      const data = await getConnectionStatus();
      console.log('📡 Connection response:', data);
      
      if (data.isConnected) {
        setIsConnected(true);
        setIsVideoLoading(false);
        setVideoError(false);
        console.log('✅ Camera connected!');
      } else {
        setIsConnected(false);
        setIsVideoLoading(false);
        setVideoError(true);
        console.log('❌ Camera not connected');
      }
    } catch (error) {
      setIsConnected(false);
      setIsVideoLoading(false);
      setVideoError(true);
      console.log('❌ Connection check failed:', error.message);
    }
  };

  const handleCameraCommand = async (direction) => {
  console.log(`📷 Sending camera command: ${direction}`);
  try {
    const result = await sendCameraCommand(direction, 'esp32-test-001');
    if (result && !result.error) {
      console.log(`✅ Camera ${direction} command sent!`);
    } else {
      console.log(`❌ Camera ${direction} failed:`, result?.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Error sending command:', error);
  }
};

  const reloadVideo = () => {
    console.log('🔄 Reloading video...');
    setIsVideoLoading(true);
    setVideoError(false);
    checkConnectionAndLoadVideo();
  };

  const toggleVideoVisibility = () => {
    setIsVideoVisible(prev => !prev);
  };

  useEffect(() => {
    checkConnectionAndLoadVideo();

    checkIntervalRef.current = setInterval(() => {
      checkConnectionAndLoadVideo();
    }, 30000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  return {
    isVideoLoading,
    videoError,
    isVideoVisible,
    isConnected,
    videoStreamUrl,
    handleCameraCommand,
    reloadVideo,
    toggleVideoVisibility,
    checkConnectionAndLoadVideo,
  };
};