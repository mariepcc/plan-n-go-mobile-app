import { Stack } from "expo-router";
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import CustomCardCarousal from "../../../components/home/CustomCardCarousal";
import { supabase } from "../../lib/supabase-client";

export default function Page() {
  const [userId, setUserId] = useState(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);

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
        <CustomCardCarousal
          data={upcomingMeetings}
          userId={userId}
          autoPlay={false}
          pagination={true}
        />
      </View>
      <View style={styles.carouselContainer}>
        <Text style={styles.text}>Past meetings:</Text>
        <CustomCardCarousal
          data={pastMeetings}
          userId={userId}
          autoPlay={false}
          pagination={true}
        />
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
    marginTop:15,
  },
});
