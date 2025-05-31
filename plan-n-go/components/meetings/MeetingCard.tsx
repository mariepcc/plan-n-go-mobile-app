import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React, { useState } from "react";
import DatePicker from "./DatePicker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MeetingCard({
  title,
  date,
  userId,
}: {
  title: string;
  date: Date;
  userId: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.titleHeader}>
        <Text style={styles.titleText}>{title}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={22}
          color="#7a297a"
        />
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.divider} />
          <View style={styles.selectedDateContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.selectedDate}>{date.toDateString()}</Text>
          </View>
          <Text>Places ideas: </Text>
        </>
      )}
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
  titleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,

    color: "#7a297a",
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
});
