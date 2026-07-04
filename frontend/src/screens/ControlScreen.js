// screens/ControlScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  StatusBar, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeAreaView } from 'react-native-safe-area-context';
// Components
import ControlHeader from '../components/control/ControlHeader';
import CarRemoteControl from '../components/control/CarRemoteControl';
import LiveCameraView from '../components/control/LiveCameraView';
import CameraControlTab from '../components/control/CameraControlTab';
import OtherStatusControls from '../components/control/OtherStatusControls';
import BottomMetricsBar from '../components/control/BottomMetricsBar';
import GlassCard from '../components/common/GlassCard';

// Hooks
import { useControlState } from '../hooks/useControlState';
import { useCamera } from '../hooks/useCamera';

const { width, height } = Dimensions.get('window');

const ControlScreen = ({ onBack }) => {
  const [controlView, setControlView] = useState('camera');
  const [isOrientationLocked, setIsOrientationLocked] = useState(false);

  const {
    autoMode,
    ploughing,
    seedDropper,
    soilCoverer,
    estimatedTime,
    toggleAutoMode,
    togglePloughing,
    toggleSeedDropper,
    toggleSoilCoverer,
  } = useControlState();

  const {
    isVideoLoading,
    videoError,
    isVideoVisible,
    videoStreamUrl,
    handleCameraCommand,
    reloadVideo,
    toggleVideoVisibility,
  } = useCamera();

  // Lock landscape
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
        );
        setIsOrientationLocked(true);
      } catch (error) {
        console.log('Orientation lock error:', error);
        setIsOrientationLocked(true); // Continue anyway
      }
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync().catch(() => {});
    };
  }, []);

  if (!isOrientationLocked) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleCarDirection = (direction) => {
    console.log(`Car moving: ${direction}`);
  };

  const handleEmergencyStop = () => {
    console.log('Emergency Stop!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      <ControlHeader onBack={onBack} />

      <View style={styles.mainLayout}>
        {/* Column 1: Car Remote Control */}
        <View style={[styles.column, styles.columnLeft]}>
          <GlassCard>
            <CarRemoteControl 
              onDirectionPress={handleCarDirection}
              onEmergencyStop={handleEmergencyStop}
            />
          </GlassCard>
        </View>

        {/* Right Side */}
        <View style={[styles.column, styles.columnRight]}>
          <View style={styles.rightTopRow}>
            {/* Camera View */}
            <View style={[styles.column, styles.columnRightinLeft]}>
              <GlassCard style={{ padding: 6 }}>
                <LiveCameraView
                  videoStreamUrl={videoStreamUrl}
                  isVideoVisible={isVideoVisible}
                  onToggleVisibility={toggleVideoVisibility}
                  onReload={reloadVideo}
                  isLoading={isVideoLoading}
                  hasError={videoError}
                />
              </GlassCard>
            </View>

            {/* Status & Controls */}
            <View style={[styles.column, styles.columnRightinRight]}>
              <GlassCard style={{ paddingRight: 10, paddingLeft: 6, paddingTop: 6 }}>
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      { backgroundColor: controlView === 'camera' ? '#8BC34A' : 'transparent' }
                    ]}
                    onPress={() => setControlView('camera')}
                  >
                    <Text style={controlView === 'camera' ? styles.tabTextActive : styles.tabTextInactive}>
                      Camera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      { backgroundColor: controlView === 'other' ? '#8BC34A' : 'transparent' }
                    ]}
                    onPress={() => setControlView('other')}
                  >
                    <Text style={controlView === 'other' ? styles.tabTextActive : styles.tabTextInactive}>
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>

                {controlView === 'camera' ? (
                  <CameraControlTab onCommand={handleCameraCommand} />
                ) : (
                  <OtherStatusControls
                    autoMode={autoMode}
                    onToggleAutoMode={toggleAutoMode}
                    ploughing={ploughing}
                    onTogglePloughing={togglePloughing}
                    seedDropper={seedDropper}
                    onToggleSeedDropper={toggleSeedDropper}
                    soilCoverer={soilCoverer}
                    onToggleSoilCoverer={toggleSoilCoverer}
                    estimatedTime={estimatedTime}
                  />
                )}
              </GlassCard>
            </View>
          </View>

          <View style={styles.bottomFullRow}>
            <GlassCard>
              <BottomMetricsBar latency="23ms" signalStrength={3} batteryLevel={85} />
            </GlassCard>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1E13',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8BC34A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: width * 0.03,
    paddingBottom: 8,
    gap: 8,
  },
  column: {
    height: '100%',
  },
  columnLeft: {
    marginLeft: 10,
    width: '33%',
  },
  columnRight: {
    width: '65.5%',
    height: '100%',
    flexDirection: 'column',
    gap: 8,
  },
  rightTopRow: {
    flexDirection: 'row',
    height: '78%',
    gap: 8,
  },
  columnRightinLeft: {
    width: '50%',
    height: '100%',
  },
  columnRightinRight: {
    width: '50%',
    height: '100%',
  },
  bottomFullRow: {
    height: '20%',
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 2,
    alignSelf: 'center',
    width: 140,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 3,
    alignItems: 'center',
    borderRadius: 18,
  },
  tabTextActive: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ControlScreen;