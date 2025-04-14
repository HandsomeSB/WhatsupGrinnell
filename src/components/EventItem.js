import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import moment from 'moment';

const cleanText = (text) => {
  return text
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with regular space
    .replace(/^\s+/, "") // Remove leading whitespace
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Remove trailing whitespace
};

export default function EventItem({ event, onPress }) {
  const eventDate = new Date(event.pubDate);
  const eventDateString = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const eventTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const cleanedTitle = cleanText(event.title);
  const cleanedDescription = cleanText(event.description);

  return (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => onPress(event)}
      activeOpacity={0.7}
    >
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {cleanedTitle}
          </Text>
          <Text style={styles.eventDateTime}>
            {eventDateString} • {eventTime}
          </Text>
        </View>
        <Text style={styles.eventDescription} numberOfLines={3}>
          {cleanedDescription}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventItem: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eventContent: {
    padding: 20,
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 24,
  },
  eventDateTime: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 15,
    color: "#B4B4B4",
    lineHeight: 22,
  },
});
