import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { textToSpeech } from "./services/tts";
import { transcribeAudio } from "./services/transcription";
import { generateCompletionWithTools } from "./services/completion";
import { Audio } from "expo-av";

export default function VoiceChatScreen() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  /** Recording object */
  const [recording, setRecording] = useState(null);
  /** Is recording state */
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState([]);
  const maxDataPoints = 50; // Number of data points to display
  const router = useRouter();

  const processAudioData = (data) => {
    // Process the data from onRecordingStatusUpdate
    if (data && data.metering !== undefined) {
      // metering value is in dB (negative values, where 0 is max volume)
      // Convert to a positive value between 0-1 for visualization
      const normalizedValue = Math.max(0, 1 + data.metering / 100);
      
      // Update audio data array
      setAudioData(prevData => {
        const newData = [...prevData, normalizedValue];
        // Keep only the most recent data points
        if (newData.length > maxDataPoints) {
          return newData.slice(newData.length - maxDataPoints);
        }
        return newData;
      });
    }
  }

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => processAudioData(status),
        100 // Update interval in milliseconds
      );
      setRecording(recording);
      setIsRecording(true);
      await recording.startAsync();
    } catch (err) {
      console.error("Failed to start recording", err);
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
      console.error("Failed to stop recording", err);
    }
  }

  async function handleTranscribe() {
    try {
      setIsTranscribing(true);
      const audioUri = await stopRecording();
      const result = await transcribeAudio(audioUri);
      setTranscription(result);

      const response = await generateCompletionWithTools(
        result + "Response in 2 sentences or less, just list the events out"
      );
      await textToSpeech(response);
    } catch (error) {
      console.error("Transcription failed:", error);
    } finally {
      setIsTranscribing(false);
    }
  }

  async function handlePress() {
    if (isRecording) {
      await handleTranscribe();
    } else {
      await startRecording();
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Voice Search",
          headerTitleStyle: {
            color: "#fff",
          },
          headerStyle: {
            backgroundColor: "#1a1a1a",
          },
          headerTintColor: "#fff",
        }}
      />

      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && {
              width: 84 * (audioData[audioData.length - 1]*2 || 0 + 1),
              height: 84 * (audioData[audioData.length - 1]*2 || 0 + 1),
              borderRadius: 42 * (audioData[audioData.length - 1]*2 || 0 + 1),
              backgroundColor: "#1E1E1E",
            }
          ]}
          onPress={handlePress}
          disabled={isTranscribing}
        >
          <View
            style={[
              styles.innerCircle,
              isRecording && styles.recordingInnerCircle,
            ]}
          >
            {isTranscribing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View
                style={[
                  styles.recordIndicator,
                  isRecording && styles.recordingIndicator,
                ]}
              />
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.statusText}>
          {isRecording
            ? "Recording..."
            : isTranscribing
            ? "Processing..."
            : "Tap to start"}
        </Text>

        {transcription ? (
          <View style={styles.transcriptionCard}>
            <Text style={styles.transcriptionLabel}>Transcription</Text>
            <Text style={styles.transcriptionText}>{transcription}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  recordButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  recordingInnerCircle: {
    backgroundColor: "#FF3B30",
  },
  recordIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  recordingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  transcriptionCard: {
    marginTop: 40,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  transcriptionLabel: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 8,
    fontWeight: "600",
  },
  transcriptionText: {
    fontSize: 16,
    color: "#B4B4B4",
    lineHeight: 24,
  },
});
