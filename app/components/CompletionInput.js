import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { generateCompletionWithTools } from '../services/completion';

export default function CompletionInput() {
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      setCompletion('');
      const result = await generateCompletionWithTools(prompt);
      setCompletion(result);
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
            style={[styles.sendButton, isLoading && styles.loadingButton]}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send</Text>
            )}
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
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  loadingButton: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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