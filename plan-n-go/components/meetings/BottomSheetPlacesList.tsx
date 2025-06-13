import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../app/lib/supabase-client";

export default function BottomSheetPlacesList({
  meetingId,
  userId,
  onPlaceAdded,
  closeSheet,
}: {
  meetingId: string;
  userId: string;
  onPlaceAdded: () => void;
  closeSheet: () => void;
}) {
  const [text, setText] = useState("");
  const clearInput = () => {
    setText("");
  };

  const handleAddPlace = async () => {
    if (!text.trim()) {
      Alert.alert("Please enter a place name");
      return;
    }

    const { data, error } = await supabase
      .from("places")
      .insert([
        {
          name: text.trim(),
          meeting_id: meetingId,
          created_by: userId,
        },
      ])
      .select();

    if (error || !data) {
      console.error("Error adding place:", error);
      Alert.alert("Error adding place");
      return;
    }

    onPlaceAdded();
    clearInput();
    Keyboard.dismiss();
    closeSheet();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Where Should We Go?</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Enter a place..."
          style={styles.input}
          placeholderTextColor="#999"
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <FontAwesomeIcon
              icon={faCircleXmark}
              size={20}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlace}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
    color: "#fff",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingRight: 40,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  icon: {
    color: "#999",
  },
  buttonContainer: {
    width: '100%',
    alignItems: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#8FBBBC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
