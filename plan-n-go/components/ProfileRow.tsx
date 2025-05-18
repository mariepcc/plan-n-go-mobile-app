import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function ProfileRow({
  item,
  handleAddContact,
}: {
  item: {
    profiles: {
      id: string;
      username: string;
    };
  };
  handleAddContact: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={() => handleAddContact(item.profiles.id)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.name}>Profile</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>@{item.profiles.username}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>+ Add</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#000968",
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
