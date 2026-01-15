import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function ContactRow({
  item,
  handleDeleteContact,
}: {
  item: {
    friend_id: string;
    username: string;
  };
  handleDeleteContact: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={() => handleDeleteContact(item.friend_id)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.name}>Friend</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>@{item.username}</Text>
      </View>
      <View style={styles.actionContainer}>
        <FontAwesome name="trash" size={20} color="#ffffff" />
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
    backgroundColor: "#2a27277a",
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
