import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { sendAIMessage } from '../services/apiService';

const backgroundImage = require('../../assets/field_background.jpg');

export default function AIChatScreen({ onBack }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'မင်္ဂလာပါ။ ကျွန်တော် Agri-AI Assistant ပါ။ စိုက်ပျိုးရေးနဲ့ပတ်သက်တဲ့ မေးခွန်းတွေကို ဖြေကြားပေးပါ့မယ်။',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickActions = [
    { icon: 'leaf', label: '🌾 Crop Recommendation', id: 'crop', placeholder: 'ဘယ်မြေမှာ ဘာစိုက်ရမလဲ?' },
    { icon: 'bug', label: '🦠 Disease Guide', id: 'disease', placeholder: 'အရွက်ဝါနေတယ် ဘာလုပ်ရမလဲ?' },
    { icon: 'pest', label: '🐛 Pest Control', id: 'pest', placeholder: 'စပါးပိုးကျနေတယ် ဘယ်လိုကုသမလဲ?' },
    { icon: 'sprout', label: '🌱 Fertilizer Guide', id: 'fertilizer', placeholder: 'မြေဩဇာ ဘယ်လိုရွေးချယ်ရမလဲ?' },
    { icon: 'book', label: '📖 Farming Guide', id: 'farming', placeholder: 'စပါး ဘယ်လိုစိုက်ရမလဲ?' },
    { icon: 'help', label: '❓ Ask Anything', id: 'general', placeholder: 'စိုက်ပျိုးရေးနဲ့ပတ်သက်တာမေးပါ...' },
  ];

  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // ==========================================
  // Send Message
  // ==========================================
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendAIMessage(message, selectedFeature || 'general');
      
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: response.reply || 'ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားပါ။',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားပါ။',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // Quick Action - Feature ရွေးပြီး Placeholder ထည့်ပေးမယ်
  // ==========================================
  const handleQuickAction = (action) => {
    setSelectedFeature(action.id);
    setMessage(action.placeholder);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerLeft}>
              <Avatar.Icon size={36} icon="robot" backgroundColor="#8BC34A" color="#0B1E13" />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Agri-AI Assistant</Text>
                <View style={styles.poweredByContainer}>
                  <Text style={styles.poweredByText}>Powered by </Text>
                  <Text style={styles.geminiText}>Gemini</Text>
                </View>
                {selectedFeature && (
                  <Text style={styles.featureTag}>
                    {quickActions.find(a => a.id === selectedFeature)?.label}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.headerRight} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={24} color="#8BC34A" />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View key={msg.id}>
                <View
                  style={[
                    styles.messageWrapper,
                    msg.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        msg.sender === 'user' ? styles.userText : styles.aiText,
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <Text style={styles.messageTime}>{msg.time}</Text>
                  </View>
                </View>
              </View>
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#8BC34A" />
                <Text style={styles.loadingText}>Typing...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Action Buttons */}
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.quickActionBtn,
                  selectedFeature === action.id && styles.quickActionBtnActive
                ]}
                activeOpacity={0.7}
                onPress={() => handleQuickAction(action)}
              >
                <Text style={[
                  styles.quickActionText,
                  selectedFeature === action.id && styles.quickActionTextActive
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Area */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
          >
            <View style={styles.inputWrapper}>
              <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
                <Ionicons name="attach" size={24} color="#607D8B" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="စိုက်ပျိုးရေးနဲ့ပတ်သက်တာမေးပါ..."
                placeholderTextColor="#607D8B"
                value={message}
                onChangeText={setMessage}
                multiline
                onSubmitEditing={sendMessage}
                returnKeyType="send"
                editable={!isLoading}
              />

              <TouchableOpacity 
                style={[styles.sendBtn, (!message.trim() || isLoading) && styles.sendBtnDisabled]} 
                onPress={sendMessage} 
                activeOpacity={0.7}
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="send" size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>
              AI ရဲ့ အဖြေတွေက သတင်းအချက်အလက်အတွက်သာ ဖြစ်ပါတယ်
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... ခင်ဗျားရဲ့ မူရင်းစတိုင်တွေကို ထားပါ
  container: {
    paddingVertical: 40,
    flex: 1,
    backgroundColor: '#0B1E13',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 4 : 8,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 4,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  poweredByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poweredByText: {
    color: '#607D8B',
    fontSize: 10,
  },
  geminiText: {
    color: '#8BC34A',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featureTag: {
    color: '#8BC34A',
    fontSize: 9,
    fontWeight: '500',
    backgroundColor: 'rgba(139, 195, 74, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  headerRight: {
    padding: 4,
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 12,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  chatContent: {
    paddingVertical: 12,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: 'rgba(139, 195, 74, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.3)',
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#E0E0E0',
  },
  messageTime: {
    color: '#607D8B',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 8,
  },
  loadingText: {
    color: '#607D8B',
    fontSize: 12,
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(11, 30, 19, 0.70)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    gap: 6,
  },
  quickActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 195, 74, 0.2)',
  },
  quickActionBtnActive: {
    backgroundColor: 'rgba(139, 195, 74, 0.2)',
    borderColor: '#8BC34A',
  },
  quickActionText: {
    color: '#8BC34A',
    fontSize: 10,
    fontWeight: '500',
  },
  quickActionTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 16 : 8,
    backgroundColor: 'rgba(11, 30, 19, 0.92)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  attachBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 80,
  },
  sendBtn: {
    backgroundColor: '#43A047',
    borderRadius: 25,
    padding: 10,
    margin: 2,
  },
  sendBtnDisabled: {
    backgroundColor: '#455A64',
  },
  disclaimer: {
    color: '#455A64',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
  },
});