import {
  FlatList,
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../../lib/supabase-client";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function CostsTab() {
  const { groupId, userId } = useLocalSearchParams<{
    groupId: string;
    userId: string;
  }>();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(
    null
  );
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );

  const fetchExpenses = useCallback(async () => {
    const { data, error } = await supabase
      .from("group_expenses")
      .select("*")
      .eq("group_id", groupId);

    if (error) {
      console.error("Error fetching expenses:", error);
    } else if (data) {
      setExpenses(data);

      const returnedUserIds = new Set<string>(
        data
          .filter((expense) => expense.is_returned)
          .map((expense) => expense.user_id)
      );
      setSelectedMembers(returnedUserIds);
    }
  }, [groupId]);

  const toggleExpand = (expenseId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedExpenseId((prevId) => (prevId === expenseId ? null : expenseId));
  };

  const toggleReturnedStatus = async (
    userIdToUpdate: string,
    expenseId: string,
    currentIsReturned: boolean
  ) => {
    const { error } = await supabase
      .from("expenses")
      .update({ is_returned: !currentIsReturned })
      .eq("user_id", userIdToUpdate)
      .eq("id", expenseId);

    if (error) {
      console.error("Failed to update is_returned status:", error);
    } else {
      fetchExpenses();
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>No expenses found.</Text>
        ) : (
          <FlatList
            data={expenses.filter((item) => item.user_id === userId)}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isCreatedByMe = item.created_by === userId;
              const isExpanded = expandedExpenseId === item.id;

              return (
                <TouchableOpacity
                  activeOpacity={isCreatedByMe ? 0.8 : 1}
                  onPress={() => {
                    if (isCreatedByMe) {
                      toggleExpand(item.id);
                    }
                  }}
                >
                  <LinearGradient
                    colors={["#ffecd2be", "#f6f4f247", "#9fd4fcbe"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                  >
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>
                          {item.meeting_title}
                        </Text>
                        <Text style={styles.cardAmount}>
                          You spent:{" "}
                          <Text style={styles.cardAmountValue}>
                            {item.amount} zł
                          </Text>
                        </Text>
                      </View>
                      {isCreatedByMe && (
                        <Ionicons
                          name={
                            isExpanded
                              ? "chevron-up-circle"
                              : "chevron-down-circle"
                          }
                          size={25}
                          color="#081f38"
                        />
                      )}
                    </View>
                    {!isCreatedByMe && (
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: item.is_returned
                              ? "#DCFCE7"
                              : "#FEE2E2",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: item.is_returned ? "#166534" : "#991B1B" },
                          ]}
                        >
                          {item.is_returned ? "Returned" : "Pending"}
                        </Text>
                      </View>
                    )}
                    {isCreatedByMe && isExpanded && (
                      <View style={styles.expandedSection}>
                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>Who owes you:</Text>
                        <FlatList
                          data={expenses.filter(
                            (expense) =>
                              expense.created_by === userId &&
                              expense.user_id !== userId &&
                              expense.meeting_title === item.meeting_title
                          )}
                          keyExtractor={(expense) => expense.id}
                          renderItem={({ item: expenseItem }) => (
                            <TouchableOpacity
                              style={styles.listItem}
                              onPress={() =>
                                toggleReturnedStatus(
                                  expenseItem.user_id,
                                  expenseItem.id,
                                  expenseItem.is_returned
                                )
                              }
                            >
                              <View style={styles.iconLeft}>
                                <FontAwesome name="user" size={20} />
                              </View>
                              <View style={styles.textContainer}>
                                <Text style={styles.name}>
                                  {expenseItem.username} : {expenseItem.amount}{" "}
                                  zł
                                </Text>
                              </View>
                              <View style={styles.iconRight}>
                                {expenseItem.is_returned ? (
                                  <FontAwesome
                                    name="check-circle"
                                    size={20}
                                    color="#081f38"
                                  />
                                ) : (
                                  <FontAwesome name="circle-thin" size={20} />
                                )}
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            }}
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
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardAmountValue: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  expandedSection: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#afcbe210",
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
  },

  iconLeft: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconRight: {
    marginLeft: 12,
  },
});
