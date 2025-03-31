import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import CompletionInput from './components/CompletionInput';
import { Stack } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      <SafeAreaView style={{flex: 1}}>
        <View style={{
          width: 200,
          height: 100,
          backgroundColor: '#444654',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          alignSelf: 'center',
          marginTop: 40,
        }}>
          <Text style={{color: '#fff'}}>Hello</Text>
        </View>
      </SafeAreaView>
      
      
      <CompletionInput style={styles.completionInputContainer}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
  completionInputContainer: {
    flex: 1,
  },
}); 