// components/control/CarRemoteControl.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CarRemoteControl = ({ onDirectionPress, onEmergencyStop }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.columnTitle}>Car Remote Control</Text>
      
      {/* D-Pad */}
      <View style={styles.dpadContainer}>
        <View style={styles.joypadOuter}>
          <TouchableOpacity 
            style={[styles.dpadBtn, styles.btnUp]}
            onPress={() => onDirectionPress?.('forward')}
          >
            <Ionicons name="chevron-up" size={28} color="#FFFFFF" />
            <Text style={styles.dpadLabel}>FORWARD</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dpadBtn, styles.btnLeft]}
            onPress={() => onDirectionPress?.('left')}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            <Text style={styles.dpadLabel}>LEFT</Text>
          </TouchableOpacity>

          <View style={styles.joypadCenter} />

          <TouchableOpacity 
            style={[styles.dpadBtn, styles.btnRight]}
            onPress={() => onDirectionPress?.('right')}
          >
            <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
            <Text style={styles.dpadLabel}>RIGHT</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dpadBtn, styles.btnDown]}
            onPress={() => onDirectionPress?.('backward')}
          >
            <Text style={styles.dpadLabel}>BACKWARD</Text>
            <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Stop */}
      <TouchableOpacity 
        style={styles.emergencyBtn}
        onPress={onEmergencyStop}
      >
        <Text style={styles.emergencyText}>EMERGENCY STOP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  columnTitle: {
    color: '#8BC34A',
    fontSize: 11,
    fontWeight: 'bold',
    padding: 5,
    marginBottom: 4,
  },
  dpadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    flex: 1,
  },
  joypadOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(139,195,74,0.15)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joypadCenter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8BC34A',
    backgroundColor: '#0B1E13',
    zIndex: 5,
  },
  dpadBtn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  btnUp: {
    top: 6,
    width: '100%',
  },
  btnDown: {
    bottom: 6,
    width: '100%',
  },
  btnLeft: {
    left: 6,
    height: '100%',
  },
  btnRight: {
    right: 6,
    height: '100%',
  },
  dpadLabel: {
    color: '#607D8B',
    fontSize: 8,
    fontWeight: 'bold',
  },
  emergencyBtn: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderWidth: 1.5,
    borderColor: '#D32F2F',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  emergencyText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default CarRemoteControl;