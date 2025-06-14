import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";


export function ProfileRow({
  item,
  handleAddContact,
}: {
  item: {
    id: string;
    username: string;
  };

  handleAddContact: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={() => handleAddContact(item.id)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.name}>Profile</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>@{item.username}</Text>
      </View>
      <View style={styles.actionContainer}>
        <FontAwesome name="user-plus" size={18} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  handle: {
    fontSize: 14,
    color: "#666",
  },
  actionContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#93c47d",
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
