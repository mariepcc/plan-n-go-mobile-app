import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import MeetingCard from "../../../../components/meetings/MeetingCard";
import MeetingCardCreate from "../../../../components/meetings/CardCreate";
import { supabase } from "../../../lib/supabase-client";
import { AntDesign } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetMethods,
} from "../../../../components/meetings/BottomSheet";
import BottomSheetPlacesList from "../../../../components/meetings/BottomSheetPlacesList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function MeetingsTab() {
  const { groupId, userId } = useLocalSearchParams<{ groupId: string, userId: string }>();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [place, setPlace] = useState<string>("");

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  
  const fetchMeetings = useCallback(async () => {
    const { data, error } = await supabase
      .from("meetings")
      .select(
        `
    *,
    places (
      id,
      name,
      created_by
    )
  `
      )
      .eq("group_id", groupId)
      .order("scheduled_at", { ascending: false });
    console.log("spotkania: ", data);

    if (!error) setMeetings(data || []);
  }, [groupId]);

  useEffect(() => {
    fetchMeetings();
  }, [setMeetings]);


  const expandSheet = useCallback((meetingId: string) => {
    setSelectedMeetingId(meetingId);
    bottomSheetRef.current?.expand();
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

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
          created_by: userId,
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
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView>
          <ScrollView>
            <View style={{ flex: 1, padding: 16 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddMeeting}
              >
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
                  places={meeting.places}
                  userId={meeting.created_by}
                  onAddPlace={() => expandSheet(meeting.id)}
                />
              ))}

              <BottomSheet
                ref={bottomSheetRef}
                snapTo="90%"
                backgroundColor="white"
                backDropColor="black"
              >
                <BottomSheetPlacesList
                  meetingId={selectedMeetingId}
                  userId={userId}
                  onPlaceAdded={fetchMeetings}
                  closeSheet={closeSheet}
                />
              </BottomSheet>
            </View>
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
    marginBottom: 10,
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
