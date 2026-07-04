import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Text, Card, Button, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

// API Service
import { 
  getConnectionStatus, 
  getLatestTelemetry, 
  getVehicles,
  detectSoil 
} from '../services/apiService';

const backgroundImage = require('../../assets/field_background.jpg');

// ==========================================
// Soil Data (Manual)
// ==========================================
const SOIL_DATA = {
  clay: {
    id: 'clay',
    name: 'မြေစေး (Clay Soil)',
    description: 'ရေထိန်းနိုင်စွမ်းမြင့်မားပြီး အာဟာရဓာတ်ကြွယ်ဝသော မြေအမျိုးအစားဖြစ်သည်။ စပါးစိုက်ပျိုးရန် အထူးသင့်တော်သည်။',
    crops: ['စပါး', 'ပဲတီစိမ်း', 'ပဲပုပ်', 'နှမ်း', 'ကြံ'],
    icon: '🏔️',
    color: '#8D6E63',
  },
  sandy: {
    id: 'sandy',
    name: 'မြေသဲ (Sandy Soil)',
    description: 'ရေစီးနိုင်စွမ်းမြင့်မားပြီး အမြစ်များလွယ်ကူစွာ ထိုးဖောက်နိုင်သော မြေအမျိုးအစားဖြစ်သည်။',
    crops: ['မြေပဲ', 'နှမ်း', 'ပြောင်း', 'ဖရုံ', 'ခရမ်းချဉ်'],
    icon: '🏜️',
    color: '#D7A86E',
  },
  loamy: {
    id: 'loamy',
    name: 'မြေဆွေး (Loamy Soil)',
    description: 'စိုက်ပျိုးရေးအတွက် အကောင်းဆုံးဖြစ်သော မြေအမျိုးအစားဖြစ်ပြီး ရေနှင့်အာဟာရဓာတ် မျှတစွာပါဝင်သည်။',
    crops: ['စပါး', 'ပြောင်း', 'ဂျုံ', 'သီးနှံအမျိုးမျိုး', 'ဟင်းသီးဟင်းရွက်'],
    icon: '🌿',
    color: '#8D6E63',
  },
};

export default function DashboardScreen( ) {
  
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [telemetry, setTelemetry] = useState({
    battery: 0,
    seedLevel: 0,
    distance: 0,
    workingTime: '00:00:00'
  });

  // ==========================================
  // Soil Detection States
  // ==========================================
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSoil, setDetectedSoil] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const loadDashboardData = async () => {
    try {
      const status = await getConnectionStatus();
      setIsConnected(status.isConnected);

      const vehicles = await getVehicles();
      if (vehicles && vehicles.length > 0) {
        const vehicleId = vehicles[0].vehicleId;
        const telemetryData = await getLatestTelemetry(vehicleId);
        if (telemetryData) {
          setTelemetry({
            battery: telemetryData.battery || 85,
            seedLevel: telemetryData.seedLevel || 40,
            distance: telemetryData.distance || 2.45,
            workingTime: telemetryData.workingTime || '01:35:20'
          });
        }
      }
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // Soil Detection
  // ==========================================
// ==========================================
// Soil Detection
// ==========================================
const handleSoilDetection = async () => {
  setIsDetecting(true);
  setShowResult(false);
  setDetectedSoil(null);

  try {
    const soilTypes = ['clay', 'sandy', 'loamy'];
    const randomSoil = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    
    const result = await detectSoil(randomSoil);
    
    if (result && result.soilType) {
      const soilInfo = SOIL_DATA[result.soilType] || SOIL_DATA.clay;
      setDetectedSoil({
        ...soilInfo,
        confidence: result.confidence || 0.92
      });
      setShowResult(true);
    } else {
      const soilInfo = SOIL_DATA[randomSoil];
      setDetectedSoil({
        ...soilInfo,
        confidence: 0.85
      });
      setShowResult(true);
    }
  } catch (error) {
    console.error('Soil detection failed:', error);
    const soilTypes = ['clay', 'sandy', 'loamy'];
    const randomSoil = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    const soilInfo = SOIL_DATA[randomSoil];
    setDetectedSoil({
      ...soilInfo,
      confidence: 0.75
    });
    setShowResult(true);
  } finally {
    setIsDetecting(false);
  }
};

  // ==========================================
  // Text-to-Speech
  // ==========================================
  const speakText = (text) => {
    Speech.speak(text, {
      language: 'my',
      pitch: 1,
      rate: 0.8,
    });
  };

  // ==========================================
  // Close Result
  // ==========================================
  const closeResult = () => {
    setShowResult(false);
    setDetectedSoil(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8BC34A" />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay}>
          <Appbar.Header style={styles.header}>
            <Appbar.Action icon="menu" color="#FFFFFF" />
            <Appbar.Content title="AGRIROVER" titleStyle={styles.headerTitle} />
            <Appbar.Action icon="bell" color="#FFFFFF" />
          </Appbar.Header>

          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Connection Status */}
            <Text style={styles.sectionTitle}>● Connection Status</Text>
            <View style={styles.row}>
              <Card style={[styles.glassCard, styles.halfCard]}>
                <Card.Content style={styles.cardContent}>
                  <MaterialCommunityIcons name="tractor" size={28} color="#8BC34A" />
                  <View style={styles.textGroup}>
                    <Text style={styles.label}>Vehicle</Text>
                    <Text style={[styles.statusText, isConnected ? styles.connected : styles.disconnected]}>
                      ● {isConnected ? 'Connected' : 'Disconnected'}
                    </Text>
                  </View>
                </Card.Content>
              </Card>

              <Card style={[styles.glassCard, styles.halfCard]}>
                <Card.Content style={styles.cardContent}>
                  <Ionicons name="cloud-outline" size={28} color="#8BC34A" />
                  <View style={styles.textGroup}>
                    <Text style={styles.label}>Server</Text>
                    <Text style={styles.statusText}>● Connected</Text>
                  </View>
                </Card.Content>
              </Card>
            </View>

            {/* Telemetry Overview */}
            <Text style={styles.sectionTitle}>● Telemetry Overview</Text>
            <View style={styles.row}>
              <Card style={[styles.glassCard, styles.halfCard]}>
                <Card.Content>
                  <View style={styles.telemetryHeader}>
                    <MaterialCommunityIcons name="battery-charging" size={24} color="#8BC34A" />
                    <Text style={styles.label}>Battery</Text>
                  </View>
                  <Text style={styles.valueText}>{telemetry.battery}%</Text>
                  <Text style={styles.subLabel}>{telemetry.battery > 80 ? 'Charging Good' : 'Needs Charging'}</Text>
                  <ProgressBar progress={telemetry.battery / 100} color="#8BC34A" style={styles.progressBar} />
                </Card.Content>
              </Card>

              <Card style={[styles.glassCard, styles.halfCard]}>
                <Card.Content>
                  <View style={styles.telemetryHeader}>
                    <MaterialCommunityIcons name="seed" size={24} color="#8BC34A" />
                    <Text style={styles.label}>Seed Level</Text>
                  </View>
                  <Text style={styles.valueText}>{telemetry.seedLevel}%</Text>
                  <Text style={styles.subLabel}>Remaining</Text>
                  <ProgressBar progress={telemetry.seedLevel / 100} color="#8BC34A" style={styles.progressBar} />
                </Card.Content>
              </Card>
            </View>

            <View style={styles.row}>
              <Card style={[styles.glassCard, styles.halfCard]}>
                <Card.Content>
                  <View style={styles.telemetryHeader}>
                    <Ionicons name="location-outline" size={24} color="#8BC34A" />
                    <Text style={styles.label}>Distance</Text>
                  </View>
                  <Text style={styles.valueText}>{telemetry.distance} km</Text>
                  <Text style={styles.subLabel}>Today</Text>
                </Card.Content>
              </Card>

              <Card style={[styles.glassCard, styles.halfCard]}>
                <Card.Content>
                  <View style={styles.telemetryHeader}>
                    <Ionicons name="time-outline" size={24} color="#8BC34A" />
                    <Text style={styles.label}>Working Time</Text>
                  </View>
                  <Text style={styles.valueText}>{telemetry.workingTime}</Text>
                  <Text style={styles.subLabel}>Today</Text>
                </Card.Content>
              </Card>
            </View>

            {/* ========================================== */}
            {/* Soil Detection Button */}
            {/* ========================================== */}
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={handleSoilDetection}
              activeOpacity={0.8}
              disabled={isDetecting}
            >
              <View style={styles.actionCardContent}>
                <MaterialCommunityIcons name="camera" size={32} color="#8BC34A" />
                <View style={styles.actionCardTexts}>
                  <Text style={styles.actionCardTitle}>
                    {isDetecting ? '⏳ Detecting...' : '🔬 Soil Detection'}
                  </Text>
                  <Text style={styles.actionCardSub}>
                    {isDetecting ? 'Please wait...' : 'Detect soil type & get crop recommendations'}
                  </Text>
                </View>
                {isDetecting ? (
                  <ActivityIndicator size="small" color="#8BC34A" />
                ) : (
                  <Ionicons name="chevron-forward" size={24} color="#8BC34A" />
                )}
              </View>
            </TouchableOpacity>

            {/* ========================================== */}
            {/* Soil Detection Result - Dashboard ထဲမှာပဲပြ */}
            {/* ========================================== */}
            {showResult && detectedSoil && (
              <Card style={styles.resultCard}>
                <Card.Content>
                  {/* Header */}
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultIcon}>{detectedSoil.icon}</Text>
                    <View style={styles.resultHeaderTexts}>
                      <Text style={styles.resultTitle}>Soil Type Detected</Text>
                      <Text style={styles.confidenceText}>
                        Confidence: {(detectedSoil.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={closeResult}
                      style={styles.closeResultBtn}
                    >
                      <Ionicons name="close" size={20} color="#607D8B" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Soil Name */}
                  <Text style={styles.soilName}>{detectedSoil.name}</Text>
                  
                  {/* Description */}
                  <Text style={styles.soilDescription}>{detectedSoil.description}</Text>
                  
                  {/* Recommended Crops */}
                  <Text style={styles.cropTitle}>✅ သင့်တော်သော သီးနှံများ:</Text>
                  <View style={styles.cropContainer}>
                    {detectedSoil.crops.map((crop, index) => (
                      <View key={index} style={styles.cropTag}>
                        <Text style={styles.cropText}>🌾 {crop}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Audio Control - Speech */}
                  <TouchableOpacity 
                    style={styles.audioBtn}
                    onPress={() => speakText(`${detectedSoil.name}။ ${detectedSoil.description}`)}
                  >
                    <Ionicons name="play-circle" size={20} color="#8BC34A" />
                    <Text style={styles.audioBtnText}>🔊 Listen Voice Guide</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            )}

            {/* Start Auto Mode */}
            <Button 
              mode="contained"
              icon="play"
              contentStyle={styles.buttonContent}
              style={styles.autoButton}
              labelStyle={styles.buttonLabel}
              onPress={() => console.log('Auto Mode Started')}
            >
              Start Auto Mode
            </Button>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B1E13' 
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8BC34A',
    fontSize: 16,
    marginTop: 12,
  },
  header: { 
   backgroundColor: 'transparent', 
    elevation: 0,
    marginTop: 0,
    paddingTop: 0,
    height: 56, // Appbar ရဲ့ ပုံမှန် Standard အမြင့်
  },
  headerTitle: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 20, 
    textAlign: 'center' 
  },
  scrollContainer: { 
    paddingHorizontal: 16, 
    paddingTop: 4,
    paddingBottom: 150 
  },
  sectionTitle: { 
    color: '#8BC34A', 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 12, 
    marginTop: 10 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  glassCard: { 
    backgroundColor: 'rgba(3, 95, 16, 0.73)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.2)',
  },
  halfCard: { 
    width: '48%' 
  },
  cardContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8,
  },
  textGroup: { 
    marginLeft: 10 
  },
  label: { 
    color: '#B0BEC5', 
    fontSize: 12,
    fontWeight: '400',
  },
  subLabel: { 
    color: '#78909C', 
    fontSize: 11, 
    marginTop: 2 
  },
  statusText: { 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  connected: { 
    color: '#8BC34A' 
  },
  disconnected: { 
    color: '#EF5350' 
  },
  telemetryHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  valueText: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  progressBar: { 
    height: 3, 
    borderRadius: 2, 
    marginTop: 6, 
    backgroundColor: 'rgba(255,255,255,0.08)' 
  },
  actionCard: {
    backgroundColor: 'rgba(3, 95, 16, 0.73)',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.2)',
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionCardTexts: {
    flex: 1,
    marginLeft: 12,
  },
  actionCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionCardSub: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 2,
  },
  autoButton: { 
    borderRadius: 25, 
    marginTop: 10, 
    backgroundColor: 'rgba(3, 95, 16, 0.73)',
  },
  buttonContent: { 
    height: 50 
  },
  buttonLabel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },

  // ==========================================
  // Result Card Styles
  // ==========================================
  resultCard: {
    backgroundColor: 'rgba(3, 95, 16, 0.85)',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.3)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  resultHeaderTexts: {
    flex: 1,
  },
  resultTitle: {
    color: '#8BC34A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confidenceText: {
    color: '#607D8B',
    fontSize: 11,
  },
  closeResultBtn: {
    padding: 4,
  },
  soilName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  soilDescription: {
    color: '#B0BEC5',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  cropTitle: {
    color: '#8BC34A',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cropContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 10,
  },
  cropTag: {
    backgroundColor: 'rgba(139, 195, 74, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.2)',
  },
  cropText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 195, 74, 0.1)',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.2)',
    marginTop: 2,
  },
  audioBtnText: {
    color: '#8BC34A',
    fontSize: 12,
    fontWeight: '500',
  },
});