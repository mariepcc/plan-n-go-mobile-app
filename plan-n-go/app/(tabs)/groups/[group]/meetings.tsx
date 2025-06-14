import {
  Text,
  View,
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
import BottomSheetVote from "../../../../components/meetings/BottomSheetVote";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function MeetingsTab() {
  const { groupId, userId } = useLocalSearchParams<{
    groupId: string;
    userId: string;
  }>();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState(new Date());

  const bottomSheetPlacesRef = useRef<BottomSheetMethods>(null);
  const bottomSheetVotesRef = useRef<BottomSheetMethods>(null);

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

    if (!error) setMeetings(data || []);
  }, [groupId]);

  useEffect(() => {
    fetchMeetings();
  }, [setMeetings]);

  const expandSheetPlaces = useCallback((meetingId: string) => {
    setSelectedMeetingId(meetingId);
    bottomSheetPlacesRef.current?.expand();
  }, []);

  const expandSheetVotes = useCallback((meetingId: string) => {
    setSelectedMeetingId(meetingId);
    bottomSheetVotesRef.current?.expand();
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetPlacesRef.current?.close();
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
    } else {
      console.error(error);
      alert("Failed to save meeting");
    }
  }

  function handleAddMeeting() {
    setTitle("");
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
                  userId={userId}
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
                  onAddPlace={() => expandSheetPlaces(meeting.id)}
                  onVote={() => expandSheetVotes(meeting.id)}
                />
              ))}
            </View>
          </ScrollView>
          <BottomSheet
            ref={bottomSheetPlacesRef}
            snapTo="85%"
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
          <BottomSheetVote
            ref={bottomSheetVotesRef}
            meetingId={selectedMeetingId}
            userId={userId}
            closeSheet={closeSheet}
            snapTo={"70%"}
            backgroundColor={"white"}
            backDropColor={"black"}
          />
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 10,

  },
  iconContainer: {
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: "#fff",
    padding: 6,
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
