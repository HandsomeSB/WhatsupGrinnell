import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function Results() {
  const { query } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Search Results',
          headerShown: true
        }} 
      />
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.text}>Search Results for: {query}</Text>
      </SafeAreaView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
}); 