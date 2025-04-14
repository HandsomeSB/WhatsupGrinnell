import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { generateCompletionWithTools } from "../services/completion";
import EventItem from "../components/EventItem";

export default function Results() {
  const { query } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const jsonSchema = {
          type: "json_schema",
          name: "event_list",
          schema: {
            type: "object",
            properties: {
              events: {
                type: "array",
                description: "A list of events.",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "The title of the event.",
                    },
                    pubDate: {
                      type: "string",
                      description: "The publication date of the event.",
                    },
                    description: {
                      type: "string",
                      description: "A detailed description of the event.",
                    },
                  },
                  required: ["title", "pubDate", "description"],
                  additionalProperties: false,
                },
              },
            },
            required: ["events"],
            additionalProperties: false,
          },
          strict: true,
        };

        // Add specific instructions for JSON format
        const searchQuery = `Please search for events matching: "${query}". Return results in JSON format.`;
        const results = await generateCompletionWithTools(
          searchQuery,
          jsonSchema
        );

        try {
          const resultJson = JSON.parse(results);
          if (
            resultJson &&
            resultJson.events &&
            Array.isArray(resultJson.events)
          ) {
            setData(resultJson.events);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          setError(
            "Could not process the search results. Please try different search terms."
          );
          setData([]);
        }
      } catch (err) {
        setError("Failed to load results. Please try again.");
        console.error("Error fetching results:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error ||
          (loading ? "Loading..." : "No events found matching your search")}
      </Text>
    </View>
  );

  const handleEventPress = (event) => {
    router.push({
      pathname: "/eventDetails",
      params: { event: JSON.stringify(event) },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Search Results",
          headerShown: true,
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Searching events...</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            ListEmptyComponent={renderEmptyState}
            renderItem = {
              ({ item }) => <EventItem event={item} onPress={handleEventPress}/>
            }
            keyExtractor={(item, index) => item.title + index}
            contentContainerStyle={styles.listContent}
          />
        )}
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
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#B4B4B4",
    textAlign: "center",
    lineHeight: 24,
  },
});
