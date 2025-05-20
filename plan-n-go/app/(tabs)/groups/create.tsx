import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { supabase } from "../../lib/supabase-client";
import { MemberSelector } from "../../../components/MemberSelector";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CreateGroupScreen() {
  const [user, setUser] = useState(null);

  const { name: initialName } = useLocalSearchParams<{ name: string }>();
  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );

  const router = useRouter();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  useEffect(() => {
    if (initialName) {
      setGroupName(initialName);
    }
  }, [initialName]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name.");
      return;
    }
    try {
      const { data: group, error } = await supabase
        .from("groups")
        .insert({ name: groupName, owner_id: user.id })
        .select()
        .single();

      const groupId = group.id;

      await supabase.from("memberships").insert([
        ...Array.from(selectedContacts).map((profileId) => ({
          group_id: groupId,
          profileId,
        })),
        { group_id: groupId, profile_id: user.id },
      ]);
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not create group.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Group</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Enter group name"
          style={styles.input}
          value={groupName}
          onChangeText={setGroupName}
        />
        <TouchableOpacity onPress={handleCreateGroup}>
          <View style={styles.actionContainer}>
            <FontAwesome name="plus" size={24} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>
      {user?.id && (
        <MemberSelector
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          userId={user.id}
        />
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
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
