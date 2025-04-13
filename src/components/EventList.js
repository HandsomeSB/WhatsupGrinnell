import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import EventItem from "./EventItem";
import { updateAndGetCachedRSS } from "../services/chamberRSS";
import { useRouter } from "expo-router";

export default function EventList({ selectedDate }) {
  const [groupedEvents, setGroupedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsByDate = await updateAndGetCachedRSS();
      console.log("Fetched events:", eventsByDate);
      setGroupedEvents(eventsByDate);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleEventPress = (event) => {
    router.push({
      pathname: "/eventDetails",
      params: { event: JSON.stringify(event) },
    });
  };

  const filterEventsByDate = (events) => {
    if (!selectedDate) return events;

    const selectedDateStr = selectedDate.toDateString();
    return events.filter((section) => section.title === selectedDateStr);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  const filteredEvents = filterEventsByDate(groupedEvents);

  if (filteredEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No events found for this date</Text>
      </View>
    );
  }

  const renderDatePage = ({ item }) => (
    <View style={styles.pageContainer}>
      <Text style={styles.dateHeader}>{item.title}</Text>
      {item.data.map((event) => (
        <EventItem key={event.guid} event={event} onPress={handleEventPress} />
      ))}
    </View>
  );

  return (
    <FlatList
      data={filteredEvents}
      renderItem={renderDatePage}
      keyExtractor={(item) => item.title}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.flatListContent}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#B4B4B4",
    textAlign: "center",
  },
  pageContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  dateHeader: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
    opacity: 0.9,
  },
  flatListContent: {
    flexGrow: 1,
  },
});
