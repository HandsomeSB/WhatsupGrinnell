import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Dimensions } from 'react-native';
import EventItem from './EventItem';
import { fetchGrinnellChamberRSS } from '../services/tools';
import { useRouter } from 'expo-router';

export default function EventList() {
  const [sections, setSections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await fetchGrinnellChamberRSS();
      const groupedEvents = groupEventsByDate(events.rss.channel.item);
      setSections(groupedEvents);
    };
    fetchEvents();
  }, []);

  const groupEventsByDate = (events) => {
    const grouped = events.reduce((acc, event) => {
      const eventDate = new Date(event.pubDate).toDateString(); // Group by date
      if (!acc[eventDate]) {
        acc[eventDate] = [];
      }
      acc[eventDate].push(event);
      return acc;
    }, {});

    return Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));
  };

  const handleEventPress = (event) => {
    router.push({
      pathname: '/eventDetails',
      params: { event: JSON.stringify(event) }
    });
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <EventItem 
            event={item} 
            onPress={handleEventPress}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.line} />
            <Text style={styles.sectionHeaderText}>{title}</Text>
            <View style={styles.line} />
          </View>
        )}
        keyExtractor={item => item.guid}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        style={styles.sectionList}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>No events available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
    height: Dimensions.get('window').height * 0.5,
  },
  sectionList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 8,
  },
});