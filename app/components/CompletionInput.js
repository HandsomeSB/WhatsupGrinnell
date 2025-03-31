import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { generateCompletionWithTools } from '../services/completion';

export default function CompletionInput() {
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      setCompletion('');
      const result = await generateCompletionWithTools(prompt);
      setCompletion(result);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setCompletion('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {completion ? (
              <View style={styles.messageContainer}>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{completion}</Text>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { height: Math.max(40, inputHeight) }]}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Message ChatGPT..."
            placeholderTextColor="#8e8ea0"
            multiline
            onContentSizeChange={(event) => {
              setInputHeight(event.nativeEvent.contentSize.height);
            }}
            onKeyPress={handleKeyPress}
          />
        </View>
        <TouchableOpacity 
          style={[styles.sendButton]}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageBubble: {
    backgroundColor: '#444654',
    borderRadius: 8,
    padding: 16,
    maxWidth: '100%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#565869',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    padding: 8,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    color: '#fff',
    fontSize: 16,
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#19c37d',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 