import { Text, View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-client";

export default function GroupInfoScreen() {
  const { group: groupId } = useLocalSearchParams<{ group: string }>();
  const [name, setName] = useState<string>("");
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
      .from("groups")
      .select(
        `
        id,
        name,
        memberships (
          profiles:profile_id (
            username
          )
        )
      `
      )
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error fetching group info:", error);
      console.log("error:", error);
    } else {
      setName(data.name);
      setMembers(
        data.memberships.flatMap((m) => m.profiles.map((p) => p.username))
      );
      console.log("Members:", members);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Info</Text>
      <Text style={styles.subtitle}>Group name: {name}</Text>
      <View style={styles.membersList}>
        <Text style={styles.subtitle}>Members:</Text>
        {members.map((username) => (
          <Text>• {username}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  membersList: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
});
