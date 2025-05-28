import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";



export default function MeetingsTab() {
  const [meetingName, setMeetingName] = useState<string>("");
  const { groupId } = useLocalSearchParams<{ groupId: string }>();


  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Upcoming + Past Meetings</Text>
    </View>
  );
}
