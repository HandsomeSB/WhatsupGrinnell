import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { generateCompletionWithTools } from './services/completion';
import EventItem from './components/EventItem';

export default function Results() {
  const { query } = useLocalSearchParams();
  const [ data, setData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      jsonSchema = {
        "type": "json_schema",
        "name": "event_list",
        "schema": {
          "type": "object",
          "properties": {
            "events": {
              "type": "array",
              "description": "A list of events.",
              "items": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "description": "The title of the event."
                  },
                  "pubDate": {
                    "type": "string",
                    "description": "The publication date of the event."
                  },
                  "description": {
                    "type": "string",
                    "description": "A detailed description of the event."
                  }
                },
                "required": [
                  "title",
                  "pubDate",
                  "description"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "events"
          ],
          "additionalProperties": false
        },
        "strict": true
      }
      console.log(query);
      const results = await generateCompletionWithTools(query, jsonSchema);
      const resultJson = JSON.parse(results);
      setData(resultJson.events); 
    };
    fetchResults();
  }, [query]);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Search Results',
          headerShown: true
        }} 
      />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={data}
          // ListEmptyComponent={
          //   isLoading ? <LoadingIndicator /> : <EmptyListMessage />
          // }
          renderItem={({ item }) => <EventItem event={item} />}
          keyExtractor={(item) => item.title}
        />
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