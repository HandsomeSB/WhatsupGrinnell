import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function EventDetails() {
  const { event } = useLocalSearchParams();
  const parsedEvent = JSON.parse(event);
  
  const eventDate = new Date(parsedEvent.pubDate);
  const eventDateString = eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const eventTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Event Details',
          headerShown: true
        }} 
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>{parsedEvent.title}</Text>
            <Text style={styles.dateTime}>{eventDateString} • {eventTime}</Text>
            <Text style={styles.description}>{parsedEvent.description}</Text>
          </View>
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 16,
    color: '#8e8ea0',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
}); 