import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import DatePicker from "./DatePicker";
import { Ionicons } from "@expo/vector-icons";

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
        <TouchableOpacity style={styles.inlineFab} onPress={onSave}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6F0FA",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d0dce8",
  },
  titleInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 6,
    marginBottom: 16,
    opacity: 0.6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#741b47",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  selectedDate: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  icon: {
    marginRight: 6,
  },
  inlineFab: {
    backgroundColor: "#5A505F",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
