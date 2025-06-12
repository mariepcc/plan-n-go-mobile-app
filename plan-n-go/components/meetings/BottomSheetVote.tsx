import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { supabase } from "../../app/lib/supabase-client";

export function BottomSheetVote({
  meetingId,
  userId,
  closeSheet,
}: {
  meetingId: string;
  userId: string;
  closeSheet: () => void;
}) {
  const [places, setPlaces] = useState<any[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [votedPlaceId, setVotedPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: placesData, error: placesError } = await supabase
        .from("places")
        .select("id, name")
        .eq("meeting_id", meetingId);

      const { data: votesData, error: votesError } = await supabase
        .from("votes")
        .select("place_id, user_id, meeting_id");

      if (placesError || votesError) {
        console.error("Error loading data:", placesError || votesError);
        return;
      }
      console.log("idiki: ", votesData)

      const voteCount = votesData?.reduce((acc, vote) => {
        acc[vote.place_id] = (acc[vote.place_id] || 0) + 1;
        if (vote.user_id === userId) setVotedPlaceId(vote.place_id);
        return acc;
      }, {} as Record<string, number>);

      const userVote = votesData?.find(
        (vote) => vote.user_id === userId && vote.meeting_id === meetingId
      );

      setVotedPlaceId(userVote?.place_id ?? null);
      setPlaces(placesData || []);
      setVotes(voteCount || {});
      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel("realtime-votes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes" },
        (payload) => {
          console.log(payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [votedPlaceId, meetingId]);

  const handleVote = async (placeId: string) => {
    if (placeId === votedPlaceId) {
      await supabase
        .from("votes")
        .delete()
        .eq("user_id", userId)
        .eq("place_id", placeId);
      setVotedPlaceId(null);
    } else {
      await supabase.from("votes").delete().eq("user_id", userId).eq("meeting_id", meetingId);;
      await supabase
        .from("votes")
        .insert({ user_id: userId, place_id: placeId, meeting_id: meetingId });
      setVotedPlaceId(placeId);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your favorite spot!</Text>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No places found.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleVote(item.id)}
          >
            <View style={styles.iconLeft}>
              <FontAwesome name="map-marker" size={20} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.voteCount}>
                {votes[item.id] || 0} vote
                {(votes[item.id] || 0) !== 1 ? "s" : ""}
              </Text>
            </View>
            <View style={styles.iconRight}>
              {votedPlaceId === item.id ? (
                <FontAwesome name="check-circle" size={20} color="#007AFF" />
              ) : (
                <FontAwesome name="circle-thin" size={20} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7a297a",
    textAlign: "center",
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconLeft: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  voteCount: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  iconRight: {
    marginLeft: 12,
  },
});
