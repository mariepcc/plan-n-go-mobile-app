import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase-client";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        getProfile();
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  const doLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error Signing Out User", error.message);
    }
  };

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");
      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: "Account" }} />

      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#eee" }]}
            value={user?.email ?? ""}
            editable={false}
          />
        </View>

        <View style={styles.verticallySpaced}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={user?.username}
            onChangeText={setUsername}
            editable={!loading}
            placeholder={user?.username ?? ""}
          />
        </View>

        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            title={loading ? "Loading..." : "Update"}
            onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
            disabled={loading}
            color="#000968"
          />
        </View>

        <View style={styles.verticallySpaced}>
          <TouchableOpacity onPress={doLogout} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    marginVertical: 8,
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 14,
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
    backgroundColor: "#a64d79",
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
