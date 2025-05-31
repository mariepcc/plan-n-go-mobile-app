import { Image, Button, StyleSheet, Text, View, TextInput,
 } from "react-native";
import React from "react";
import DatePicker from "./DatePicker";

export default function MeetingCard({
  title,
  setTitle,
  date,
  setDate,
  userId,
  editable = false,
  onSave,
}: {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  userId: string;
  editable?: boolean;
  onSave?: () => void;
}) {

const dateCallback = (selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    console.log("Selected date => " + currentDate)
  }


  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput
          style={styles.input}
          placeholder="Add a title"
          value={title}
          onChangeText={setTitle}
          editable={editable}
        />
      </View>
      <View style={styles.input}>
        <DatePicker selectedDateCallback={this.dateCallback} />
        <Text> Selected Date : {date.toDateString()} </Text>
      </View>

      {editable && onSave && (
        <Button title="Save Meeting" onPress={onSave} />
      )}
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
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, 
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});
