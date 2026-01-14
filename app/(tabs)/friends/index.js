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
import { useNavigation } from "expo-router";
import { supabase } from "../../lib/supabase-client";
import { ContactRow } from "../../../components/friends/ContactRow";
import { ProfileRow } from "../../../components/friends/ProfileRow";
import { Stack } from "expo-router";

export default function FriendsIndex() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const navigation = useNavigation();

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setSearch("");
      setProfiles([]);
    });

    return unsubscribe;
  }, [navigation]);

  async function loadContacts(userId) {
    const { data, error } = await supabase
      .from("user_contacts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setContacts(
      data?.map((profile) => ({
        ...profile,
        type: "contact",
      })) ?? []
    );
  }

  async function handleAddContact(profileId) {
    const { error } = await supabase.from("contacts").insert([
      {
        user_id: user.id,
        friend_id: profileId,
      },
      {
        user_id: profileId,
        friend_id: user.id,
      },
    ]);

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
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${profileId}),and(user_id.eq.${profileId},friend_id.eq.${user.id})`
      );

    loadContacts(user.id);
  }

  async function handleProfileSearch() {
    if (!search.trim()) {
      setProfiles([]);
      setNoResults(false);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${search}%`)
      .neq("id", user?.id);

    const filtered = (data ?? []).filter(
      (p) => !contacts.some((c) => c.profile_id === p.id)
    );

    setProfiles(filtered ?? []);
    setNoResults(filtered.length === 0);
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
        {noResults && (
          <Text style={{ textAlign: "center", color: "gray", marginBottom: 8 }}>
            No user found.
          </Text>
        )}

        <FlatList
          data={[...profiles, ...contacts]}
          extraData={contacts}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    marginVertical: 8,
  },
  input: {
    borderColor: "#040405",
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    padding: 12,
    margin: 8,
  },
  buttonContainer: {
    backgroundColor: "#2193b0",
    borderRadius: 10,
    paddingVertical: 8,
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
