import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import CompletionInput from './components/CompletionInput';
import { Stack } from 'expo-router';
import EventList from './components/EventList';

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      <SafeAreaView style={styles.safeArea}>
        <EventList />
      </SafeAreaView>
      
      <CompletionInput style={styles.completionInputContainer}/>
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
  completionInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
}); 