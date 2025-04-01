import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { textToSpeech } from './services/tts';

export default function VoiceChatScreen() {
    useEffect(() => {
        textToSpeech("Hello, how can I help you today?");
    }, []);

    return (
        <View style={styles.container}>
        <Stack.Screen 
            options={{ 
            headerShown: true,
            title: 'Voice Chat'
            }} 
        />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
