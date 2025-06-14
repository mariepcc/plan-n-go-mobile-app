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
import MemberRow from "../../../../components/members/MemberRow";

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
            <MemberRow key={username} name={username}></MemberRow>
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
    paddingTop: 5,
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
    marginTop: 5,
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 10,
  },
  actionContainer: {
    height: 48,
    width: 48,
    backgroundColor: "#e06666",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
});