import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function MobileConsultationRoom() {
  const { id } = useLocalSearchParams();
  const [mode, setMode] = useState<'VIDEO' | 'CHAT'>('VIDEO');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Dr. Amina Bello',
      text: 'Good day Amaka. I have reviewed your triage check. How can I help you today?',
      time: '10:02 AM',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera roll access is needed to share clinical photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setUploadedImages((prev) => [...prev, uri]);
        Alert.alert('Clinical Photo Uploaded', 'Your photo has been shared securely with the attending doctor.');
      }
    } catch (err) {
      console.log('Image picker error:', err);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Camera Permission required', 'Camera access is needed to take a clinical rash photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setUploadedImages((prev) => [...prev, uri]);
        Alert.alert('Rash Photo Captured', 'Image uploaded to encrypted consultation file.');
      }
    } catch (err) {
      console.log('Camera error:', err);
    }
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Consultation',
      'Are you sure you want to end this clinical encounter? Your doctor will finalize notes and prescription.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => router.replace('/(patient-tabs)/records'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.doctorTitle}>Dr. Amina Bello (Locum GP)</Text>
          <Text style={styles.licenseBadge}>MDCN-78320 • Active Consultation</Text>
        </View>

        <View style={styles.timerBadge}>
          <View style={styles.redRecordingDot} />
          <Text style={styles.timerText}>{formatTimer(seconds)}</Text>
        </View>
      </View>

      {/* Mode Switcher */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'VIDEO' && styles.modeTabActive]}
          onPress={() => setMode('VIDEO')}
        >
          <Text style={[styles.modeTabText, mode === 'VIDEO' && styles.modeTabTextActive]}>
            📹 Video Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, mode === 'CHAT' && styles.modeTabActive]}
          onPress={() => setMode('CHAT')}
        >
          <Text style={[styles.modeTabText, mode === 'CHAT' && styles.modeTabTextActive]}>
            💬 Chat Alternative
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'VIDEO' ? (
        <View style={styles.videoStage}>
          {/* Main Remote Doctor Stream View */}
          <View style={styles.doctorStream}>
            <View style={styles.doctorAvatarCircle}>
              <Text style={{ fontSize: 44 }}>👩‍⚕️</Text>
            </View>
            <Text style={styles.doctorStreamName}>Dr. Amina Bello (Live)</Text>
            <Text style={styles.connectionQuality}>HD Video Connected • 256kbps</Text>
          </View>

          {/* Self Preview Pip */}
          <View style={styles.pipView}>
            {isVideoOn ? (
              <View style={styles.pipContent}>
                <Text style={{ fontSize: 20 }}>👤</Text>
                <Text style={styles.pipLabel}>You</Text>
              </View>
            ) : (
              <View style={[styles.pipContent, { backgroundColor: '#222326' }]}>
                <Text style={{ color: '#ffffff', fontSize: 10 }}>Camera Off</Text>
              </View>
            )}
          </View>

          {/* Uploaded Clinical Images Strip */}
          {uploadedImages.length > 0 && (
            <View style={styles.imagePreviewStrip}>
              <Text style={styles.imageStripTitle}>Shared Rash / Clinical Photos:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {uploadedImages.map((uri, idx) => (
                  <Image key={idx} source={{ uri }} style={styles.uploadedThumbnail} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bottom Call Controls */}
          <View style={styles.controlsBar}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonOff]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
              <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isVideoOn && styles.controlButtonOff]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Text style={styles.controlIcon}>{isVideoOn ? '📹' : '🚫'}</Text>
              <Text style={styles.controlLabel}>{isVideoOn ? 'Stop Cam' : 'Start Cam'}</Text>
            </TouchableOpacity>

            {/* Native Rash Photo Upload Button */}
            <TouchableOpacity style={styles.controlButton} onPress={handlePickImage}>
              <Text style={styles.controlIcon}>📷</Text>
              <Text style={styles.controlLabel}>Share Photo</Text>
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
              <Text style={styles.endCallText}>End</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Chat Alternative View */
        <View style={styles.chatStage}>
          <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 16, gap: 12 }}>
            {chatMessages.map((msg, idx) => {
              const isMe = msg.sender === 'You';
              return (
                <View
                  key={idx}
                  style={[styles.chatBubbleWrapper, isMe ? styles.chatRight : styles.chatLeft]}
                >
                  <View style={[styles.chatBubble, isMe ? styles.chatBubbleMe : styles.chatBubbleDoctor]}>
                    <Text style={[styles.chatSender, isMe && { color: '#b1dbb8' }]}>{msg.sender}</Text>
                    <Text style={[styles.chatText, isMe && { color: '#ffffff' }]}>{msg.text}</Text>
                    <Text style={[styles.chatTime, isMe && { color: '#ffffff99' }]}>{msg.time}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.chatInputBar}>
            <TouchableOpacity style={styles.cameraIconBtn} onPress={handleTakePhoto}>
              <Text style={{ fontSize: 20 }}>📸</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Type message to doctor..."
              placeholderTextColor="#747679"
              value={inputMsg}
              onChangeText={setInputMsg}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080331',
  },
  topHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a3922',
  },
  doctorTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  licenseBadge: {
    color: '#b1dbb8',
    fontSize: 11,
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  redRecordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff643b',
  },
  timerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#1b1463',
    padding: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeTabActive: {
    backgroundColor: '#0f3e17',
  },
  modeTabText: {
    color: '#747679',
    fontSize: 12,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#ffffff',
  },
  videoStage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  doctorStream: {
    flex: 1,
    backgroundColor: '#0a3922',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e1f4df',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  doctorStreamName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  connectionQuality: {
    color: '#31ce01',
    fontSize: 12,
    marginTop: 4,
  },
  pipView: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 90,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 6,
  },
  pipContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e1f4df',
  },
  pipLabel: {
    fontSize: 10,
    color: '#0f3e17',
    fontWeight: '700',
    marginTop: 2,
  },
  imagePreviewStrip: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 12,
  },
  imageStripTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  uploadedThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 8,
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#080331',
    borderTopWidth: 1,
    borderTopColor: '#ffffff15',
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
  },
  controlButtonOff: {
    opacity: 0.5,
  },
  controlIcon: {
    fontSize: 22,
  },
  controlLabel: {
    color: '#ffffff',
    fontSize: 11,
  },
  endCallButton: {
    backgroundColor: '#ff643b',
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  endCallText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  chatStage: {
    flex: 1,
    backgroundColor: '#f8f3eb',
    justifyContent: 'space-between',
  },
  chatScroll: {
    flex: 1,
  },
  chatBubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  chatLeft: {
    justifyContent: 'flex-start',
  },
  chatRight: {
    justifyContent: 'flex-end',
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
  },
  chatBubbleDoctor: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#efeeeb',
  },
  chatBubbleMe: {
    backgroundColor: '#0f3e17',
  },
  chatSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f3e17',
    marginBottom: 2,
  },
  chatText: {
    fontSize: 13,
    color: '#080331',
    lineHeight: 18,
  },
  chatTime: {
    fontSize: 9,
    color: '#747679',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#efeeeb',
    gap: 8,
  },
  cameraIconBtn: {
    padding: 6,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#f8f3eb',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#0f3e17',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
});
