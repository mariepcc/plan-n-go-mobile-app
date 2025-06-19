import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../app/lib/supabase-client";
import BackDrop from "./BackDrop";

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

interface Props {
  snapTo: string;
  backgroundColor: string;
  backDropColor: string;
  meetingId: string;
  userId: string;
  closeSheet: () => void;
}

const BottomSheetExpenses = forwardRef<BottomSheetMethods, Props>(
  (
    { snapTo, backgroundColor, backDropColor, meetingId, userId, closeSheet },
    ref
  ) => {
    const [members, setMembers] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<Record<string, number>>({});
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [divideEvenly, setDivideEvenly] = useState(true);

    const scrollBegin = useSharedValue(0);
    const [enableScroll, setEnableScroll] = useState(true);

    const insets = useSafeAreaInsets();
    const { height } = Dimensions.get("window");
    const openHeight = height * (1 - parseFloat(snapTo.replace("%", "")) / 100);
    const closeHeight = height;
    const topAnimation = useSharedValue(closeHeight);
    const scrollY = useSharedValue(0);
    const context = useSharedValue(0);

    const expand = useCallback(() => {
      "worklet";
      topAnimation.value = withTiming(openHeight);
    }, [openHeight, topAnimation]);

    const close = useCallback(() => {
      "worklet";
      topAnimation.value = withTiming(closeHeight);
    }, [closeHeight, topAnimation]);

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close]
    );

    const animationStyle = useAnimatedStyle(() => {
      return {
        top: topAnimation.value,
      };
    });

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("meetings_members")
        .select("user_id, username")
        .eq("meeting_id", meetingId);

      if (error) {
        console.error("Error fetching group members:", error);
      } else {
        setMembers(data);
      }
    };

    useEffect(() => {
      fetchData();
    }, [meetingId]);

    useEffect(() => {
      if (divideEvenly && members.length > 0) {
        const evenAmount = totalAmount / members.length;
        const newExpenses: Record<string, number> = {};
        members.forEach((member) => {
          newExpenses[member.user_id] = parseFloat(evenAmount.toFixed(2));
        });
        setExpenses(newExpenses);
      }
    }, [divideEvenly, totalAmount, members]);

    const handleSaveExpenses = async () => {
      try {
        const updates = Object.entries(expenses).map(([userId, amount]) => ({
          meeting_id: meetingId,
          user_id: userId,
          amount: amount || 0,
          is_returned: false,
        }));

        const { error } = await supabase
          .from("expenses")
          .upsert(updates);

        if (error) {
          console.error("Error saving expenses:", error);
        } else {
          console.log("Expenses saved!");
          closeSheet();
        }
      } catch (err) {
        console.error("Unexpected error saving expenses:", err);
      }
    };

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate((event) => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(context.value + event.translationY, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    const onScroll = useAnimatedScrollHandler({
      onBeginDrag: (event) => {
        scrollBegin.value = event.contentOffset.y;
      },
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
      },
    });

    const panScroll = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate((event) => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else if (event.translationY > 0 && scrollY.value === 0) {
          runOnJS(setEnableScroll)(false);
          topAnimation.value = withSpring(
            Math.max(context.value + event.translationY - scrollBegin.value, openHeight),
            { damping: 100, stiffness: 400 }
          );
        }
      })
      .onEnd(() => {
        runOnJS(setEnableScroll)(true);
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, { damping: 100, stiffness: 400 });
        } else {
          topAnimation.value = withSpring(openHeight, { damping: 100, stiffness: 400 });
        }
      });

    const scrollViewGesture = Gesture.Native();

    return (
      <>
        <BackDrop
          topAnimation={topAnimation}
          backDropColor={backDropColor}
          closeHeight={closeHeight}
          openHeight={openHeight}
          close={close}
        />
        <GestureDetector gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}>
          <Animated.View
            style={[styles.sheet, animationStyle, { backgroundColor }]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <Text style={styles.title}>Manage Expenses</Text>

            <View style={styles.totalInputContainer}>
              <Text style={{ marginBottom: 6 }}>Total Amount (€)</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Enter total amount"
                value={totalAmount.toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) || 0;
                  setTotalAmount(value);
                }}
                style={styles.totalInput}
              />
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setDivideEvenly(true)}
                style={[
                  styles.toggleButton,
                  divideEvenly && styles.toggleButtonActive,
                ]}
              >
                <Text style={styles.toggleButtonText}>Divide Evenly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDivideEvenly(false)}
                style={[
                  styles.toggleButton,
                  !divideEvenly && styles.toggleButtonActive,
                ]}
              >
                <Text style={styles.toggleButtonText}>Custom</Text>
              </TouchableOpacity>
            </View>

            <Animated.FlatList
              scrollEventThrottle={16}
              onScroll={onScroll}
              scrollEnabled={enableScroll}
              data={members}
              keyExtractor={(item) => item.user_id}
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No members found.
                </Text>
              }
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.name}>{item.username}</Text>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.memberInput}
                    value={expenses[item.user_id]?.toString() || ''}
                    onChangeText={(text) => {
                      const value = parseFloat(text);
                      setExpenses((prev) => ({ ...prev, [item.user_id]: value }));
                    }}
                    editable={!divideEvenly}
                  />
                </View>
              )}
            />

            <TouchableOpacity
              onPress={handleSaveExpenses}
              style={{
                margin: 20,
                padding: 16,
                backgroundColor: "#5A505F",
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                Save Expenses
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

export default BottomSheetExpenses;

const styles = StyleSheet.create({
  sheet: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handle: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5A505F",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  totalInputContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  totalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  toggleButtonActive: {
    backgroundColor: "#5A505F",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  memberInput: {
    width: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "right",
  },
});
