import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CompletionInput from './components/CompletionInput';
import { Stack, useRouter } from 'expo-router';
import EventList from './components/EventList';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/results',
        params: { query: searchQuery }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <EventList />
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
  searchContainer: {
    padding: 10,
    backgroundColor: '#343541',
  },
  searchInput: {
    backgroundColor: '#40414f',
    padding: 10,
    borderRadius: 8,
    color: '#ffffff',
    fontSize: 16,
  },
  completionInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
}); 