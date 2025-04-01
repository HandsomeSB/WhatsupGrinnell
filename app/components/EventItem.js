import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function EventItem({ event, onPress }) {

    const eventDate = new Date(event.pubDate);
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
        <TouchableOpacity 
        style={styles.eventItem}
        onPress={() => onPress(event)}
        >
        <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDateTime}>{eventDateString} • {eventTime}</Text>
        </View>
        {/* <Text style={styles.eventLocation}>{event.location}</Text> */}
        <Text style={styles.eventDescription} numberOfLines={2}>
            {event.description}
        </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 100,
  },
  eventItem: {
    backgroundColor: '#444654',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  eventDateTime: {
    fontSize: 14,
    color: '#8e8ea0',
  },
  eventLocation: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#8e8ea0',
    lineHeight: 20,
  },
});
