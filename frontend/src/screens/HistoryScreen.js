import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ImageBackground, 
  ScrollView 
} from 'react-native';
import { Card, Avatar } from 'react-native-paper';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      {/* 🏞️ History Page အတွက် Background Image ထည့်သွင်းခြင်း */}
      <ImageBackground 
        source={require('../../assets/field_background.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlayLayer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <Text style={styles.pageTitle}>Analytics & History</Text>

            {/* Total Summary Card */}
            <Card style={styles.glassCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Avatar.Icon size={36} icon="chart-timeline-variant" backgroundColor="rgba(140, 232, 53, 0.1)" color="#8CE835" />
                  <Text style={styles.cardTitle}>Working Summary</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total Working Time</Text>
                  <Text style={styles.infoValue}>02:45:30</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total Seeds Dropped</Text>
                  <Text style={styles.infoValue}>1,250 pcs</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Area Covered</Text>
                  <Text style={styles.infoValue}>1.5 Acres</Text>
                </View>
              </Card.Content>
            </Card>

            {/* Recent Activities */}
            <Text style={styles.subTitle}>Recent Activities</Text>
            
            <Card style={styles.glassCardSmall}>
              <Card.Content style={styles.smallCardContent}>
                <Avatar.Icon size={28} icon="check-circle" backgroundColor="transparent" color="#8CE835" />
                <View style={styles.activityTexts}>
                  <Text style={styles.activityTitle}>Ploughing Section 1 Completed</Text>
                  <Text style={styles.activityTime}>Today, 10:30 AM</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.glassCardSmall}>
              <Card.Content style={styles.smallCardContent}>
                <Avatar.Icon size={28} icon="alert-circle" backgroundColor="transparent" color="#E53935" />
                <View style={styles.activityTexts}>
                  <Text style={styles.activityTitle}>Emergency Stop Triggered</Text>
                  <Text style={styles.activityTime}>Yesterday, 04:15 PM</Text>
                </View>
              </Card.Content>
            </Card>

          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlayLayer: {
    flex: 1,
     
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 50, // Top Appbar နေရာလွတ် ချန်ထားရန်
    paddingBottom: 90, // Bottom Navigation ကွယ်မသွားစေရန်
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    color: '#8CE835',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  glassCard: {
    backgroundColor: 'rgba(3, 95, 16, 0.73)', 
    borderRadius: 14,
    elevation: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    color: '#8CE835',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  glassCardSmall: {
    backgroundColor: 'rgba(3, 95, 16, 0.73)',
    borderRadius: 10,
    elevation: 0,
    marginBottom: 10,
  },
  smallCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  activityTexts: {
    marginLeft: 10,
    flex: 1,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  activityTime: {
    color: '#607D8B',
    fontSize: 11,
    marginTop: 2,
  },
});