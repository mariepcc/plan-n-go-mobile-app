import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { supabase } from "../../lib/supabase-client";
import { format } from "date-fns";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FloatingPoint from "../../../components/home/FloatingActionButton";
import BottomSheet, {
  BottomSheetMethods,
} from "../../../components/meetings/BottomSheet";
import BottomSheetVote from "../../../components/meetings/BottomSheetVote";
import BottomSheetPlacesList from "../../../components/meetings/BottomSheetPlacesList";
import BottomSheetExpenses from "../../../components/meetings/BottomSheetExpenses";

export default function MeetingPage() {
  const {
    meeting: meetingId,
    title: title,
    userId: userId,
  } = useLocalSearchParams<{
    meeting: string;
    title;
    userId: string;
  }>();
  const [places, setPlaces] = useState([]);
  const [date, setDate] = useState(Date);
  const [placesRefreshCounter, setPlacesRefreshCounter] = useState(0);

  const bottomSheetPlacesRef = useRef<BottomSheetMethods>(null);
  const bottomSheetVotesRef = useRef<BottomSheetMethods>(null);
  const bottomSheetExpensesRef = useRef<BottomSheetMethods>(null);

  const expandSheetPlaces = useCallback(() => {
    bottomSheetPlacesRef.current?.expand();
  }, []);

  const expandSheetVotes = useCallback(() => {
    bottomSheetVotesRef.current?.expand();
  }, []);
  const expandSheetExpenses = useCallback(() => {
    bottomSheetExpensesRef.current?.expand();
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetPlacesRef.current?.close();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMeetings();
    }, [meetingId])
  );

  async function fetchMeetings() {
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
      .eq("id", meetingId)
      .single();

    if (!error && data) {
      setPlaces(data.places ?? []);
      setDate(data.scheduled_at);
      setPlacesRefreshCounter((prev) => prev + 1);
    } else {
      console.error("Error fetching meeting:", error);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: title }} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
        >
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Image
                source={require("../../../assets/calendar.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>When?</Text>
            </View>
            <Text style={styles.cardText}>
              {format(date, "MMMM d, yyyy • h:mm a")}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Image
                source={require("../../../assets/places.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Places ideas:</Text>
            </View>
            {places.length === 0 ? (
              <Text style={styles.cardText}>No places found</Text>
            ) : (
              places.map((place) => (
                <Text key={place.id} style={styles.placeItem}>
                  • {place.name}
                </Text>
              ))
            )}
          </View>
        </ScrollView>

        <FloatingPoint
          onVote={expandSheetVotes}
          onAddSpot={expandSheetPlaces}
          onAddExpense={expandSheetExpenses}
        />
        <BottomSheet
          ref={bottomSheetPlacesRef}
          snapTo="85%"
          backgroundColor="white"
          backDropColor="black"
        >
          <BottomSheetPlacesList
            meetingId={meetingId}
            userId={userId}
            onPlaceAdded={fetchMeetings}
            closeSheet={closeSheet}
          />
        </BottomSheet>
        <BottomSheetVote
          ref={bottomSheetVotesRef}
          meetingId={meetingId}
          userId={userId}
          closeSheet={closeSheet}
          refreshPlacesCounter={placesRefreshCounter}
          snapTo={"70%"}
          backgroundColor={"white"}
          backDropColor={"black"}
        />
        <BottomSheetExpenses
          ref={bottomSheetExpensesRef}
          meetingId={meetingId}
          userId={userId}
          closeSheet={closeSheet}
          snapTo={"90%"}
          backgroundColor={"white"}
          backDropColor={"black"}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  cardText: {
    fontSize: 16,
    color: "#444",
  },
  placeItem: {
    fontSize: 16,
    color: "#444",
    marginLeft: 6,
    marginBottom: 4,
  },
});
