import React from 'react';
import { StyleSheet, View } from 'react-native';
import CompletionInput from './components/CompletionInput';
import { Stack } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />

      <CompletionInput style={styles.completionInputContainer}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
  completionInputContainer: {
    flex: 1,
  },
}); 