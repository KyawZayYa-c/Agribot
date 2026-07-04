// components/control/OtherStatusControls.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OtherStatusControls = ({
  autoMode,
  onToggleAutoMode,
  ploughing,
  onTogglePloughing,
  seedDropper,
  onToggleSeedDropper,
  soilCoverer,
  onToggleSoilCoverer,
  estimatedTime = '12 mins',
}) => {
  return (
    <View style={styles.container}>
      {/* Status - Running */}
      <View style={styles.statusRowItem}>
        <Text style={styles.statusLabel}>Status</Text>
        <View style={styles.statusRunningRow}>
          <MaterialCommunityIcons name="play-circle" size={16} color="#8BC34A" />
          <Text style={styles.statusRunning}>Running</Text>
        </View>
      </View>
      
      {/* Auto Mode */}
      <View style={styles.autoModeCard}>
        <View style={styles.autoModeRow}>
          <MaterialCommunityIcons name="autorenew" size={20} color="#8BC34A" />
          <Text style={styles.autoModeLabel}>Auto Mode</Text>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchStatusText, { color: autoMode ? '#8BC34A' : '#607D8B' }]}>
              {autoMode ? 'ON' : 'OFF'}
            </Text>
            <TouchableOpacity onPress={onToggleAutoMode} style={styles.toggleContainer}>
              <View style={[styles.toggleTrack, autoMode ? styles.toggleActive : styles.toggleInactive]}>
                <View style={[styles.toggleThumb, autoMode ? styles.toggleThumbActive : styles.toggleThumbInactive]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Ploughing */}
      <View style={styles.switchRow}>
        <MaterialCommunityIcons name="tractor" size={20} color="#8BC34A" />
        <Text style={styles.switchLabel}>Ploughing</Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchStatusText, { color: ploughing ? '#8BC34A' : '#607D8B' }]}>
            {ploughing ? 'ON' : 'OFF'}
          </Text>
          <TouchableOpacity onPress={onTogglePloughing} style={styles.toggleContainer}>
            <View style={[styles.toggleTrack, ploughing ? styles.toggleActive : styles.toggleInactive]}>
              <View style={[styles.toggleThumb, ploughing ? styles.toggleThumbActive : styles.toggleThumbInactive]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seed Dropper */}
      <View style={styles.switchRow}>
        <MaterialCommunityIcons name="seed" size={20} color="#8BC34A" />
        <Text style={styles.switchLabel}>Seed Dropper</Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchStatusText, { color: seedDropper ? '#8BC34A' : '#607D8B' }]}>
            {seedDropper ? 'ON' : 'OFF'}
          </Text>
          <TouchableOpacity onPress={onToggleSeedDropper} style={styles.toggleContainer}>
            <View style={[styles.toggleTrack, seedDropper ? styles.toggleActive : styles.toggleInactive]}>
              <View style={[styles.toggleThumb, seedDropper ? styles.toggleThumbActive : styles.toggleThumbInactive]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Soil Coverer */}
      <View style={styles.switchRow}>
        <MaterialCommunityIcons name="leaf" size={20} color="#8BC34A" />
        <Text style={styles.switchLabel}>Soil Coverer</Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchStatusText, { color: soilCoverer ? '#8BC34A' : '#607D8B' }]}>
            {soilCoverer ? 'ON' : 'OFF'}
          </Text>
          <TouchableOpacity onPress={onToggleSoilCoverer} style={styles.toggleContainer}>
            <View style={[styles.toggleTrack, soilCoverer ? styles.toggleActive : styles.toggleInactive]}>
              <View style={[styles.toggleThumb, soilCoverer ? styles.toggleThumbActive : styles.toggleThumbInactive]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Estimated Time */}
      <View style={styles.controlItem}>
        <Text style={styles.controlLabel}>Estimated Time</Text>
        <Text style={styles.controlValue}>{estimatedTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  statusRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    marginBottom: 6,
  },
  statusLabel: {
    color: '#8BC34A',
    fontSize: 11,
    fontWeight: '400',
  },
  statusRunningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusRunning: {
    color: '#8BC34A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginBottom: 3,
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    flex: 1,
    marginLeft: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchStatusText: {
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleTrack: {
    width: 32,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#43A047',
  },
  toggleInactive: {
    backgroundColor: '#455A64',
  },
  toggleThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  toggleThumbInactive: {
    alignSelf: 'flex-start',
  },
  autoModeCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginBottom: 3,
  },
  autoModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoModeLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    flex: 1,
    marginLeft: 6,
  },
  controlItem: {
    marginTop: 19,
  },
  controlLabel: {
    color: '#8BC34A',
    fontSize: 12,
  },
  controlValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default OtherStatusControls;