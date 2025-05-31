import { Text, View, Alert, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import MeetingCard from "../../../../components/meetings/MeetingCard";
import MeetingCardCreate from "../../../../components/meetings/CardCreate";
import { supabase } from "../../../lib/supabase-client";
import { AntDesign } from "@expo/vector-icons";

export default function MeetingsTab() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [place, setPlace] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  useEffect(() => {
    async function fetchMeetings() {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (!error) setMeetings(data || []);
    }

    fetchMeetings();
  }, [setMeetings]);

  async function createMeeting() {
    if (!title.trim() || !date) {
      alert("Please fill in both title and date");
      return;
    }

    const { data, error } = await supabase
      .from("meetings")
      .insert([
        {
          group_id: groupId,
          title: title,
          scheduled_at: date,
          created_by: user.id,
        },
      ])
      .select();

    if (!error && data) {
      setMeetings([data[0], ...meetings]);
      setIsAdding(false);
      setTitle("");
      setPlace("");
    } else {
      console.error(error);
      alert("Failed to save meeting");
    }
  }

  function handleAddMeeting() {
    setTitle("");
    setPlace("");
    setIsAdding(true);
  }

  return (
        <ScrollView>

    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity style={styles.button} onPress={handleAddMeeting}>
      <View style={styles.iconContainer}>
        <AntDesign name="plus" size={16} color="#fff" />
      </View>
      <Text style={styles.buttonText}>New Meeting</Text>
    </TouchableOpacity>

      {isAdding && (
        <MeetingCardCreate
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          userId={"some-user-id"}
          onSave={createMeeting}
        />
      )}

      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          title={meeting.title}
          date={new Date(meeting.scheduled_at)}
          userId={meeting.created_by}
        />
      ))}
    </View>
        </ScrollView>

  );
}

const styles = StyleSheet.create({
  
  button: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8FBBBC", 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignSelf: "flex-start",
    marginBottom: 10
  },
  iconContainer: {
    backgroundColor: "#B0CFD0",
    borderRadius: 999,
    padding: 6,
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
