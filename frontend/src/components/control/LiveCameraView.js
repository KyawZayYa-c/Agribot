// components/control/LiveCameraView.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const LiveCameraView = ({
  videoStreamUrl,
  isVideoVisible = true,
  onToggleVisibility,
  onReload,
  isLoading,
  hasError,
}) => {
  const getVideoHtml = (streamUrl) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; }
          body { 
            background: #0a0e17; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            overflow: hidden;
          }
          img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <img src="${streamUrl}" 
             onload="document.getElementById('loading').style.display='none'" 
             onerror="document.getElementById('loading').innerHTML='❌ Camera Offline'"/>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      {/* Camera Header */}
      <View style={styles.cameraHeader}>
        <View style={styles.cameraHeaderLeft}>
          <MaterialCommunityIcons name="video" size={14} color="#8BC34A" />
          <Text style={styles.cameraTitle}>Live View</Text>
          <View style={styles.liveDot} />
        </View>
        <View style={styles.cameraHeaderRight}>
          <TouchableOpacity onPress={onToggleVisibility} style={styles.cameraToggleBtn}>
            <Ionicons
              name={isVideoVisible ? 'eye' : 'eye-off'}
              size={14}
              color="#607D8B"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onReload} style={styles.cameraReloadBtn}>
            <Ionicons name="refresh" size={14} color="#607D8B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Body */}
      {isVideoVisible ? (
        <View style={styles.cameraContainer}>
          {isLoading && (
            <View style={styles.videoLoadingOverlay}>
              <ActivityIndicator size="small" color="#8BC34A" />
              <Text style={styles.videoLoadingText}>Loading...</Text>
            </View>
          )}
          {hasError ? (
            <View style={styles.videoErrorContainer}>
              <MaterialCommunityIcons name="video-off" size={28} color="#ff4444" />
              <Text style={styles.videoErrorText}>Camera Offline</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={onReload}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <WebView
              source={{ 
                html: getVideoHtml(videoStreamUrl),
                baseUrl: '' 
              }}
              style={styles.videoStream}
              javaScriptEnabled={false}
              domStorageEnabled={false}
              startInLoadingState={false}
              scalesPageToFit={true}
            />
          )}
        </View>
      ) : (
        <View style={styles.videoHiddenContainer}>
          <MaterialCommunityIcons name="video-off" size={28} color="#455A64" />
          <Text style={styles.videoHiddenText}>Camera Off</Text>
          <TouchableOpacity onPress={onToggleVisibility} style={styles.showVideoBtn}>
            <Text style={styles.showVideoBtnText}>Tap to Show</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Camera Footer */}
      <View style={styles.cameraFooter}>
        <View style={styles.cameraStatusItem}>
          <View style={styles.cameraStatusDotGreen} />
          <Text style={styles.cameraStatusText}>Streaming</Text>
        </View>
        <Text style={styles.cameraFpsText}>15 fps</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cameraHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ff4444',
  },
  cameraHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cameraToggleBtn: {
    padding: 2,
  },
  cameraReloadBtn: {
    padding: 2,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#0a0e17',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 100,
  },
  videoStream: {
    flex: 1,
    height: '100%',
    backgroundColor: '#0a0e17',
  },
  videoLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },
  videoLoadingText: {
    color: '#8BC34A',
    fontSize: 9,
    marginTop: 4,
  },
  videoErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  videoErrorText: {
    color: '#ff4444',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  retryBtn: {
    marginTop: 6,
    backgroundColor: '#8BC34A',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#0B1E13',
    fontWeight: 'bold',
    fontSize: 9,
  },
  videoHiddenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e17',
    borderRadius: 6,
    minHeight: 80,
  },
  videoHiddenText: {
    color: '#455A64',
    fontSize: 10,
    marginTop: 2,
  },
  showVideoBtn: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#455A64',
    borderRadius: 10,
  },
  showVideoBtnText: {
    color: '#607D8B',
    fontSize: 8,
  },
  cameraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  cameraStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cameraStatusDotGreen: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#8BC34A',
  },
  cameraStatusText: {
    color: '#607D8B',
    fontSize: 7,
  },
  cameraFpsText: {
    color: '#455A64',
    fontSize: 7,
  },
});

export default LiveCameraView;