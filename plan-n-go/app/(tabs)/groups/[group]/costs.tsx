import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { supabase } from "../../../lib/supabase-client";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function CostsTab() {
  const { groupId, userId } = useLocalSearchParams<{
    groupId: string;
    userId: string;
  }>();

  const [expenses, setExpenses] = useState<any[]>([]);

  const fetchMeetings = useCallback(async () => {
    const { data, error } = await supabase
      .from("group_expenses")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching existing expenses:", error);
      return;
    } else {
      setExpenses(data);
    }
  }, [groupId]);

  useEffect(() => {
    fetchMeetings();
  }, [setExpenses]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>No expenses found.</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <LinearGradient
                colors={["#ffecd2", "#fcb69f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>{item.meeting_title}</Text>
                <Text style={styles.cardAmount}>
                  Amount:{" "}
                  <Text style={styles.cardAmountValue}>{item.amount} zł</Text>
                </Text>
                <Text
                  style={[
                    styles.cardStatus,
                    { color: item.is_returned ? "green" : "red" },
                  ]}
                >
                  {item.is_returned ? "Returned" : "Not Returned"}
                </Text>
              </LinearGradient>
            )}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 25,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#FAD0B9",
    borderWidth: 1
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardAmount: {
    fontSize: 15,
    marginBottom: 4,
  },
  cardAmountValue: {
    fontWeight: "bold",
  },
  cardStatus: {
    fontSize: 14,
    marginTop: 5,
  },
});
