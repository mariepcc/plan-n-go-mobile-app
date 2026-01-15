import { Text, View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.membersList}>
          {members.map((username) => (
            <View key={username} style={styles.card}>
              <FontAwesome
                name="user-circle"
                size={24}
                color="#333"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.cardText}>{username}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  membersList: {
    flexDirection: "column",
    gap: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefbfb",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    paddingLeft: 10,
  },
});
