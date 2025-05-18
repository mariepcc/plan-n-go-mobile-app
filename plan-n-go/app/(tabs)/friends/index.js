import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase-client";
import { ContactRow } from "../../../components/ContactRow";
import { ProfileRow } from "../../../components/ProfileRow";

import { Stack } from "expo-router";

export default function FriendsIndex() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        loadContacts(user.id);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  async function loadContacts(userId) {
    const { data, error } = await supabase
      .from("contacts")
      .select(
        `
      profile_id,
      profiles!contacts_profile_id_fkey (
        id,
        username
      )
    `
      )
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });


    setProfiles(
      data?.map((profile) => ({
        ...profile,
        type: "profile",
      })) ?? []
    );
    console.log("Contacts data:", profiles);


  }

  async function handleAddContact(profileId) {
    const { error } = await supabase.from("contacts").insert({
      owner_id: user.id,
      profile_id: profileId,
    });

    setSearch("");
    setProfiles([]);

    if (error) {
      console.error("Error adding contact:", error.message);
    } else {
      Alert.alert("Friend added!");
      loadContacts(user.id);
    }
  }

  async function handleDeleteContact(profileId) {
    await supabase
      .from("contacts")
      .delete()
      .match({ owner_id: user.id, profile_id: profileId });

    loadContacts(user.id);
  }

  async function handleProfileSearch() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${search}%`)
      .neq("id", user?.id);

    setProfiles(data ?? []);
    console.log("Profile:", data);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: "Friends" }} />
      <View style={{ padding: 16 }}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={search}
          onChangeText={(text) => setSearch(text)}
          onSubmitEditing={handleProfileSearch}
        />
        <View style={styles.verticallySpaced}>
          <TouchableOpacity
            onPress={handleProfileSearch}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>SEARCH</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={[...profiles, ...contacts]}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={({ item }) =>
            item.type === "contact" ? (
              <ContactRow
                item={item}
                handleDeleteContact={handleDeleteContact}
              />
            ) : (
              <ProfileRow item={item} handleAddContact={handleAddContact} />
            )
          }
        />
        <View style={styles.verticallySpaced}>
          <TouchableOpacity
            onPress={() => user && loadContacts(user.id)}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>DEBUG LOAD CONTACTS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: "#000968",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
