import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import EventItem from './EventItem';
import { fetchGrinnellChamberRSS } from '../services/tools';
import { useRouter } from 'expo-router';

export default function EventList() {
  const [listData, setListData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await fetchGrinnellChamberRSS();
      setListData(events.rss.channel.item);
    };
    fetchEvents();
  }, []);

  const handleEventPress = (event) => {
    router.push({
      pathname: '/eventDetails',
      params: { event: JSON.stringify(event) }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        renderItem={({ item }) => (
          <EventItem 
            event={item} 
            onPress={handleEventPress}
          />
        )}
        keyExtractor={item => item.guid}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        style={styles.flatList}
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
  flatList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
}); 