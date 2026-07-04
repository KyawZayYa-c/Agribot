import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

export default function FloatingAIButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={onPress || (() => console.log('AI Chat Open'))}
      activeOpacity={0.8}
    >
      <View style={styles.fab}>
        <Image
          source={require('../../assets/ai-avatar.png')} 
          style={styles.fabImage}
          resizeMode="cover"
        />
        <View style={styles.glowRing} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 5,
    bottom: 90,
    elevation: 10,
    zIndex: 999,
  },
  fabImage: {
    width: 74,
    height:74,
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
});