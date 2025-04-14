import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import moment from 'moment';

// The RSS feed contains &nbsp, random whitespaces in the beginning and end

const cleanText = (text) => {
  return text
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with regular space
    .replace(/^\s+/, "") // Remove leading whitespace
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // trailing whitespace
};

export default function EventDetails() {
  const { event } = useLocalSearchParams();
  const parsedEvent = JSON.parse(event);

  const eventDate = moment(parsedEvent.pubDate, "ddd, DD MMM YYYY HH:mm:ss ZZ").toDate();
  const eventDateString = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const eventTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const cleanedTitle = cleanText(parsedEvent.title);
  const cleanedDescription = cleanText(parsedEvent.description);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Event Details",
          headerShown: true,
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>{cleanedTitle}</Text>
            <Text style={styles.dateTime}>
              {eventDateString} • {eventTime}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.description}>{cleanedDescription}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 24,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    lineHeight: 32,
  },
  dateTime: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: "#B4B4B4",
    lineHeight: 24,
  },
});
