import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Animated, Dimensions } from 'react-native';
import { generateCompletionWithTools } from '../services/completion';

export default function CompletionInput() {
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const screenHeight = Dimensions.get('window').height;

  const handleInputPress = () => {
    setIsExpanded(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    inputRef.current?.blur();
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  };

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

  const messageContainerTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, screenHeight * 0.3],
  });

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleCollapse}
        />
      </Animated.View>
      <Animated.View 
        style={[
          styles.messageContainerWrapper,
          {
            transform: [{ translateY: messageContainerTranslateY }],
            zIndex: 1,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }
        ]}
      >
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
                  <View style={[styles.messageBubble, { marginBottom: 200 }]}>
                    <Text style={styles.messageText}>{completion}</Text>
                  </View>
                </View>
              ) : null}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>

      <View style={[styles.inputContainer, { zIndex: 2 }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { height: Math.max(40, inputHeight) }]}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Message ChatGPT..."
            placeholderTextColor="#8e8ea0"
            multiline
            onFocus={handleInputPress}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    zIndex: 0,
  },
  overlayTouchable: {
    flex: 1,
  },
  messageContainerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    borderColor: 'blue',
    borderWidth: 1,
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
    backgroundColor: '#0f0f0f',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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