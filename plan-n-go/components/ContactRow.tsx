import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function ContactRow({ item, handleDeleteContact }) {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{item.username}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteContact(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fce4ec",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
