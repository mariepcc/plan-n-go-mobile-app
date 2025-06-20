import {
  Text,
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { supabase } from "../../../lib/supabase-client";
import { FontAwesome } from "@expo/vector-icons";

export default function MembersTab() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        groupSearch();
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  async function groupSearch() {
    const { data, error } = await supabase
      .from("group_members")
      .select("group_name, username")
      .eq("group_id", groupId);

    if (error) {
      console.error("Error fetching group info:", error);
    } else {
      setMembers(data.map((item) => item.username));
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.membersList}>
          {members.map((username) => (
            <View key={username} style={styles.card}>
              <FontAwesome name="user-circle" size={24} color="#333" style={{ marginRight: 10 }} />
              <Text style={styles.cardText}>{username}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  membersList: {
    flexDirection: "column",
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
