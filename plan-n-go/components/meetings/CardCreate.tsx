import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import React, { useState } from "react";
import DatePicker from "./DatePicker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function MeetingCardCreate({
  title,
  setTitle,
  date,
  setDate,
  userId,
  onSave,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  userId: string;
  onSave?: () => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(true);

  const dateCallback = (selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDatePicker(false);
    console.log("Selected date =>", currentDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Add a meeting title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      <View style={styles.divider} />

      <View style={styles.dateRow}>
        {showDatePicker ? (
          <DatePicker selectedDateCallback={dateCallback} />
        ) : (
          <View style={styles.selectedDateContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.selectedDate}>{date.toDateString()}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.fab} onPress={onSave}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6F0FA",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#d0dce8",
  },
  titleInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 6,
    marginBottom: 20,
    opacity: 0.6,
  },
  dateRow: {
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#741b47",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  selectedDate: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  icon: {
    marginRight: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#536878",
    width: 45,
    height: 45,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
