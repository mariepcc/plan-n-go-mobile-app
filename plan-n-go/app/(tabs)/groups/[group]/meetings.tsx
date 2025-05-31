import { Text, View, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import MeetingCard from "../../../../components/MeetingCard";
import { supabase } from "../../../lib/supabase-client";

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
      .eq("group_id", groupId);

    if (!error) setMeetings(data || []);
  }

  fetchMeetings();
}, [setMeetings]);

async function createMeeting() {
  if (!title.trim() || !place.trim()) {
    alert("Please fill in both title and place");
    return;
  }

  const { data, error } = await supabase.from("meetings").insert([
    {
      group_id: groupId,
      title: title,
      scheduled_at: date,
      created_by: user.id
    },
  ]).select();

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
    <View style={{ flex: 1, padding: 16 }}>

  <Button title="Add Meeting" onPress={handleAddMeeting} />

  {isAdding && (
  <MeetingCard
    title={title}
    setTitle={setTitle}
    date={date}
    setDate={setDate}
    userId={"some-user-id"}
    editable={true}
    onSave={createMeeting}
  />
)}


  {meetings.map((meeting) => (
  <MeetingCard
    key={meeting.id}
    title={meeting.title}
    setTitle={() => {}}
    date={meeting.scheduled_at}
    setDate={() => {}}
    userId={meeting.created_by}
    editable={false}
  />
))}
</View>

  );
}
