// hooks/useCamera.js
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { sendCameraCommand } from '../services/apiService';

export const useCamera = (esp32Ip = '10.53.54.30') => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const videoStreamUrl = `http://${esp32Ip}:81/stream`;
  const checkIntervalRef = useRef(null);

  // ✅ API URL ကို platform ပေါ်မူတည်ပြီး သတ်မှတ်ပါ
  const getApiUrl = () => {
    if (Platform.OS === 'android') {
      // Android Emulator အတွက်
      return 'http://10.0.2.2:5233/api/status/connection';
    } else if (Platform.OS === 'ios') {
      // iOS Simulator အတွက်
      return 'http://localhost:5233/api/status/connection';
    } else {
      // Real device အတွက်
      return 'http://10.53.54.172:5233/api/status/connection';
    }
  };

  const checkConnectionAndLoadVideo = async () => {
    try {
      setIsVideoLoading(true);
      setVideoError(false);
      
      const apiUrl = getApiUrl();
      console.log('🔍 Checking connection at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // ✅ Timeout သတ်မှတ်ပါ
        signal: AbortSignal.timeout(5000),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
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

  const handleCameraCommand = (direction) => {
    console.log(`📷 Sending camera command: ${direction}`);
    sendCameraCommand(direction, 'esp32-test-001')
      .then(result => {
        if (result.success) {
          console.log(`✅ Camera ${direction} command sent!`);
        } else {
          console.log(`❌ Camera ${direction} failed:`, result.error);
        }
      })
      .catch(error => {
        console.error('❌ Error sending command:', error);
      });
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

  // ✅ Auto reconnect every 30 seconds
  useEffect(() => {
    // Initial check
    checkConnectionAndLoadVideo();

    // Set up interval for periodic checks
    checkIntervalRef.current = setInterval(() => {
      checkConnectionAndLoadVideo();
    }, 30000);

    // Cleanup
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