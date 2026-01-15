import { Stack } from "expo-router";
import {
  Text,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ListItem from "../../../components/groups/ListItem";
import GroupRow from "../../../components/groups/GroupRow";
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
        title: "Test notification!",
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
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: "Groups" }} />
      <View style={{ paddingVertical: 16, paddingHorizontal: 25, flex: 1 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    width: "100%",
  },
  emptyPlaceholder: {
    alignItems: "center",
    marginTop: 20,
  },
});
