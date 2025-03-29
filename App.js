import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { transcribeAudio } from './src/services/transcription';
import CompletionInput from './src/components/CompletionInput';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recording, setRecording] = useState(null);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      await recording.startAsync();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function handleTranscribe() {
    try {
      setIsTranscribing(true);
      const audioUri = await stopRecording();
      const result = await transcribeAudio(audioUri);
      setTranscription(result);
    } catch (error) {
      console.error('Transcription failed:', error);
    } finally {
      setIsTranscribing(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <CompletionInput />
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={isRecording ? handleTranscribe : startRecording}
        disabled={isTranscribing}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop & Transcribe' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {isTranscribing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Transcribing...</Text>
        </View>
      )}

      {transcription ? (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  transcriptionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: '90%',
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 