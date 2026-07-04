import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

// Screens & Shared Components
import DashboardScreen from './src/screens/DashboardScreen';
import ControlScreen from './src/screens/ControlScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AIChatScreen from './src/screens/AIChatScreen'; 
import BottomNavBar from './src/components/BottomNavBar';
import FloatingAIButton from './src/components/FloatingAIButton';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#43A047',
    background: '#0B1E13',
  },
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showAIChat, setShowAIChat] = useState(false);

  const openAIChat = () => {
    setShowAIChat(true);
  };

  const closeAIChat = () => {
    setShowAIChat(false);
  };

  const renderScreen = () => {
    if (showAIChat) {
      return <AIChatScreen onBack={closeAIChat} />;
    }

    switch (currentTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'control':
        return <ControlScreen onBack={() => setCurrentTab('dashboard')} />;
      case 'history':
        return <HistoryScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {renderScreen()}

        {!showAIChat && currentTab !== 'control' && (
          <FloatingAIButton onPress={openAIChat} />
        )}
        
        {!showAIChat && currentTab !== 'control' && (
          <BottomNavBar activeTab={currentTab} onTabPress={setCurrentTab} />
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1E13', 
  },
});