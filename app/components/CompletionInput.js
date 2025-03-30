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

  const handleStream = async () => {
    if (!prompt.trim()) return;

    try {
      setIsStreaming(true);
      setCompletion('');
      await streamCompletion(prompt, (token) => {
        setCompletion(prev => prev + token);
      });
    } catch (error) {
      console.error('Error:', error);
      setCompletion('Error: ' + error.message);
    } finally {
      setIsStreaming(false);
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
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt..."
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity 
            style={[styles.streamButton, isStreaming && styles.streamingButton]}
            onPress={handleStream}
            disabled={isStreaming}
          >
            <Text style={styles.buttonText}>
              {isStreaming ? 'Streaming...' : 'Stream'}
            </Text>
          </TouchableOpacity>
        </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  streamButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  streamingButton: {
    backgroundColor: '#28a745',
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