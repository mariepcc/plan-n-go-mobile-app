import { Stack } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import ListItem from "../../../components/ListItem";
import GroupRow from "../../../components/GroupRow";
import { Link, useNavigation } from "expo-router";
import { supabase } from "../../lib/supabase-client";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useNotifications } from "../../../hooks/useNotifications";

export default function GroupsPage() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState([]);
  const navigation = useNavigation();

  const { scheduleNotificationAsync, cancelNotificationAsync } =
    useNotifications();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  const sendNotification = () => {
    scheduleNotificationAsync({
      content: {
        title: "🧪 Test notification!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setSearch("");
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      async function groupSearch() {
        const { data, error } = await supabase
          .from("groups")
          .select("id, name");

        if (error) {
          console.error("Error fetching groups:", error);
        } else {
          setGroups(data);
        }
      }
      groupSearch();
    }, [])
  );

  const filteredGroups = search
    ? groups.filter((group) =>
        group.name.toLowerCase().includes(search.toLowerCase())
      )
    : groups;

  const newGroup = search ? [{ type: "create", name: search }] : [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: "Groups" }} />
      <View style={{ padding: 16 }}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          ListEmptyComponent={
            <View style={styles.emptyPlaceholder}>
              <Text>Time to create new groups!</Text>
            </View>
          }
          data={[...newGroup, ...filteredGroups]}
          renderItem={({ item }) =>
            item.type === "create" ? (
              <Link
                href={{
                  pathname: "/groups/create",
                  params: { name: item.name },
                }}
              >
                <ListItem title={item.name} subTitle={"Create new group"} />
              </Link>
            ) : (
              <Link
                href={{
                  pathname: `/groups/${item.id}`,
                  params: { name: item.name, userId: user.id },
                }}
              >
                <GroupRow title={item.name} />
              </Link>
            )
          }
        />
      </View>
      <Button title="Send me a notification" onPress={sendNotification} />
      <Button title="Cancel notification" onPress={cancelNotificationAsync} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
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
  input: {
    borderColor: "#000968",
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    padding: 12,
    margin: 8,
  },
  emptyPlaceholder: {
    alignItems: "center",
    marginTop: 20,
  },
});
