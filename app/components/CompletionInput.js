import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { generateCompletion, streamCompletion } from '../services/completion';

export default function CompletionInput() {
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = async (useStreaming = false) => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      setCompletion('');
      
      if (useStreaming) {
        setIsStreaming(true);
        await streamCompletion(prompt, (token) => {
          setCompletion(prev => prev + token);
        });
        setIsStreaming(false);
      } else {
        const result = await generateCompletion(prompt);
        setCompletion(result);
      }
    } catch (error) {
      console.error('Error:', error);
      setCompletion('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {completion ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{completion}</Text>
          </View>
        ) : null}

        {isLoading && !isStreaming && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.regularButton]}
            onPress={() => handleSubmit(false)}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading && !isStreaming ? 'Generating...' : 'Generate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.streamButton]}
            onPress={() => handleSubmit(true)}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isStreaming ? 'Streaming...' : 'Stream'}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Enter your prompt..."
          multiline
          numberOfLines={4}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    fontSize: 16,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  regularButton: {
    backgroundColor: '#007AFF',
  },
  streamButton: {
    backgroundColor: '#34C759',
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
  resultContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 