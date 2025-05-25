import { Stack } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ListItem from "../../../components/ListItem"
import { Link, useNavigation } from "expo-router";
import { supabase } from "../../lib/supabase-client";
import { useEffect, useState } from "react";

export default function GroupsPage() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState([]);
  const navigation = useNavigation();

  const groupsToShow = search
  ? groups.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase())
    )
  : groups;

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
    const unsubscribe = navigation.addListener('blur', () => {
      setSearch('');
    });

    return unsubscribe;
  }, [navigation]);

  

  useEffect(() => {
    async function groupSearch() {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name")
      

      if (error) {
        console.error("Error fetching groups:", error);
      } else {
        setGroups(data);
        console.log("groups:", data)
      }
    }

      groupSearch();
  }, [setGroups]);

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
          data={[...newGroup, ...groupsToShow]}
          renderItem={({ item }) =>
            item.type === "create" ? (
              <Link
                href={{
                  pathname: "/groups/create",
                  params: { name: item.name },
                }}
              >
                <ListItem
                  title={item.name}
                  subTitle={'Create new group'}
                />
              </Link>
            ) : (
              <Link
                href={`/groups/${
                  item.id
                }`}
              >
                <ListItem
                  title={item.name}
                />
              </Link>
            )
          }
        />
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
