import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function DateSelector({ onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dates = generateDates();

  function generateDates() {
    const dateArray = [];
    const today = new Date();

    // Generate next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dateArray.push(date);
    }
    return dateArray;
  }

  const handleDatePress = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const formatDate = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date, index) => {
          const formattedDate = formatDate(date);
          const isSelected =
            date.toDateString() === selectedDate.toDateString();

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateButton, isSelected && styles.selectedDate]}
              onPress={() => handleDatePress(date)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                {formattedDate.day}
              </Text>
              <Text
                style={[styles.dateText, isSelected && styles.selectedText]}
              >
                {formattedDate.date}
              </Text>
              <Text
                style={[styles.monthText, isSelected && styles.selectedText]}
              >
                {formattedDate.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  dateButton: {
    width: 60,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
  },
  selectedDate: {
    backgroundColor: "#007AFF",
  },
  dayText: {
    color: "#B4B4B4",
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 4,
  },
  monthText: {
    color: "#B4B4B4",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
});
