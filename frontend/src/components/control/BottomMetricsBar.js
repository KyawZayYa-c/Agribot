// components/control/BottomMetricsBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const BottomMetricsBar = ({
  latency = '23ms',
  signalStrength = 3,
  batteryLevel = 85,
}) => {
  const totalBars = 4;

  return (
    <View style={styles.bottomMetricsRow}>
      {/* Latency */}
      <View style={styles.bottomMetricCard}>
        <Ionicons name="speedometer-outline" size={24} color="#8BC34A" />
        <View style={styles.bottomMetricTexts}>
          <Text style={styles.bottomMetricLabel}>Latency</Text>
          <Text style={styles.bottomMetricValue}>{latency}</Text>
        </View>
      </View>

      {/* Signal */}
      <View style={styles.bottomMetricCard}>
        <Ionicons name="cellular-outline" size={24} color="#43A047" />
        <View style={styles.bottomMetricTexts}>
          <Text style={styles.bottomMetricLabel}>Signal</Text>
          <View style={styles.signalBarsSmall}>
            {[...Array(totalBars)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.signalBarSmall,
                  { height: (index + 1) * 3 + 3 },
                  index < signalStrength 
                    ? styles.signalBarActiveSmall 
                    : styles.signalBarInactiveSmall,
                ]}
              />
            ))}
          </View>
          <Text style={styles.bottomMetricValueGreen}>
            {signalStrength >= 3 ? 'Strong' : signalStrength >= 2 ? 'Good' : 'Weak'}
          </Text>
        </View>
      </View>

      {/* Battery */}
      <View style={styles.bottomMetricCard}>
        <MaterialCommunityIcons name="battery-outline" size={24} color="#8BC34A" />
        <View style={styles.bottomMetricTexts}>
          <Text style={styles.bottomMetricLabel}>Battery</Text>
          <View style={styles.batteryContainerSmall}>
            <View style={[styles.batteryFillSmall, { width: `${batteryLevel}%` }]} />
          </View>
          <Text style={styles.bottomMetricValue}>{batteryLevel}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
    paddingHorizontal: 10,
    gap: 8,
  },
  bottomMetricCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 195, 74, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.25)',
    borderRadius: 10,
    height: '80%',
  },
  bottomMetricTexts: {
    marginLeft: 8,
  },
  bottomMetricLabel: {
    color: '#607D8B',
    fontSize: 8,
  },
  bottomMetricValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomMetricValueGreen: {
    color: '#8BC34A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signalBarsSmall: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 16,
    gap: 1,
    marginVertical: 2,
  },
  signalBarSmall: {
    width: 3,
    borderRadius: 1,
  },
  signalBarActiveSmall: {
    backgroundColor: '#8BC34A',
  },
  signalBarInactiveSmall: {
    backgroundColor: '#455A64',
  },
  batteryContainerSmall: {
    height: 8,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 2,
  },
  batteryFillSmall: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
});

export default BottomMetricsBar;