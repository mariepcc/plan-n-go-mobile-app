import { Stack } from "expo-router";
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import CustomCardCarousal from "../../../components/home/CustomCardCarousal";
import { supabase } from "../../lib/supabase-client";
import { LinearGradient } from "expo-linear-gradient";

function NoMeetingsCard({ message }: { message: string }) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={["#ffecd2", "#fcb69f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.noMeetingText}>{message}</Text>
      </LinearGradient>
    </View>
  );
}

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [pastMeetings, setPastMeetings] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchMeetings();
    }, [])
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
      .order("scheduled_at", { ascending: false });

    if (!error && data) {
      const now = new Date();

      const upcoming = data.filter(
        (meeting) => new Date(meeting.scheduled_at) >= now
      );
      const past = data.filter(
        (meeting) => new Date(meeting.scheduled_at) < now
      );

      setUpcomingMeetings(upcoming);
      setPastMeetings(past);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Home" }} />

      <View style={styles.carouselContainer}>
        <Text style={styles.text}>Upcoming meetings:</Text>
        {upcomingMeetings.length > 0 ? (
          <CustomCardCarousal
            data={upcomingMeetings}
            userId={userId}
            autoPlay={false}
            pagination={true}
          />
        ) : (
          <NoMeetingsCard message="No upcoming meetings yet. Why not create one?" />
        )}
      </View>

      <View style={styles.carouselContainer}>
        <Text style={styles.text}>Past meetings:</Text>
        {pastMeetings.length > 0 ? (
          <CustomCardCarousal
            data={pastMeetings}
            userId={userId}
            autoPlay={false}
            pagination={true}
          />
        ) : (
          <NoMeetingsCard message="No past meetings. Start planning your first meeting now!" />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
  },
  card: {
    borderRadius: 24,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 180,
    marginHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  text: {
    textAlign: "center",
    color: "#2E3A59",
    marginBottom: 12,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  carouselContainer: {
    marginTop: 15,
  },
  noMeetingCard: {
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noMeetingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});
