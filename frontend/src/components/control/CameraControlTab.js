// components/control/CameraControlTab.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CameraControlTab = ({ onCommand }) => {
  const handlePress = (direction) => {
    onCommand?.(direction);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraDpadContainer}>
        <View style={styles.cameraJoypadOuter}>
          <TouchableOpacity 
            style={[styles.cameraDpadBtn, styles.cameraBtnUp]} 
            onPress={() => handlePress('up')}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-up" size={24} color="#FFFFFF" />
            <Text style={styles.cameraDpadLabel}>UP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cameraDpadBtn, styles.cameraBtnLeft]} 
            onPress={() => handlePress('left')}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            <Text style={styles.cameraDpadLabel}>LEFT</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cameraDpadBtn, styles.cameraBtnCenter]} 
            onPress={() => handlePress('stop')}
            activeOpacity={0.7}
          >
            <Ionicons name="stop" size={24} color="#8BC34A" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cameraDpadBtn, styles.cameraBtnRight]} 
            onPress={() => handlePress('right')}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            <Text style={styles.cameraDpadLabel}>RIGHT</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cameraDpadBtn, styles.cameraBtnDown]} 
            onPress={() => handlePress('down')}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
            <Text style={styles.cameraDpadLabel}>DOWN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingHorizontal: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraDpadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  cameraJoypadOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(139,195,74,0.15)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraDpadBtn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  cameraBtnUp: {
    top: 6,
    width: '100%',
  },
  cameraBtnDown: {
    bottom: 6,
    width: '100%',
  },
  cameraBtnLeft: {
    left: 6,
    height: '100%',
  },
  cameraBtnRight: {
    right: 6,
    height: '100%',
  },
  cameraBtnCenter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8BC34A',
    backgroundColor: '#0B1E13',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraDpadLabel: {
    color: '#607D8B',
    fontSize: 7,
    fontWeight: 'bold',
    marginTop: 1,
  },
});

export default CameraControlTab;