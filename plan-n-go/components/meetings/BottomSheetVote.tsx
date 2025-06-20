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
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  FlatListProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedScrollHandler,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
  refreshPlacesCounter: number;
  closeSheet: () => void;
}

const BottomSheetVote = forwardRef<BottomSheetMethods, Props>(
  (
    {
      snapTo,
      backgroundColor,
      backDropColor,
      meetingId,
      userId,
      refreshPlacesCounter,
      closeSheet,
    },
    ref
  ) => {
    const [places, setPlaces] = useState<any[]>([]);
    const [votes, setVotes] = useState<Record<string, number>>({});
    const [votedPlaceId, setVotedPlaceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
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
      const top = topAnimation.value;
      return {
        top,
      };
    });

    const fetchData = async () => {
      const { data: placesData, error: placesError } = await supabase
        .from("places")
        .select("id, name")
        .eq("meeting_id", meetingId);

      const { data: votesData, error: votesError } = await supabase
        .from("votes")
        .select("place_id, user_id, meeting_id");

      if (!placesError && !votesError) {
        const voteCount = votesData?.reduce((acc, vote) => {
          acc[vote.place_id] = (acc[vote.place_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const userVote = votesData?.find(
          (vote) => vote.user_id === userId && vote.meeting_id === meetingId
        );

        setVotedPlaceId(userVote?.place_id ?? null);
        setPlaces(placesData || []);
        setVotes(voteCount || {});
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();

      const channel = supabase
        .channel("realtime-votes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "votes" },
          (payload) => {
            runOnJS(fetchData)();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [refreshPlacesCounter, votedPlaceId, meetingId]);

    const handleVote = async (placeId: string) => {
      if (placeId === votedPlaceId) {
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", userId)
          .eq("place_id", placeId);
        setVotedPlaceId(null);
      } else {
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", userId)
          .eq("meeting_id", meetingId);
        await supabase.from("votes").insert({
          user_id: userId,
          place_id: placeId,
          meeting_id: meetingId,
        });
        setVotedPlaceId(placeId);
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
            Math.max(
              context.value + event.translationY - scrollBegin.value,
              openHeight
            ),
            {
              damping: 100,
              stiffness: 400,
            }
          );
        }
      })
      .onEnd(() => {
        runOnJS(setEnableScroll)(true);
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
        <GestureDetector
          gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}
        >
          <Animated.View
            style={[styles.sheet, animationStyle, { backgroundColor }]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            <Text style={styles.title}>Choose your favorite spot!</Text>
            <Animated.FlatList
              scrollEventThrottle={16}
              onScroll={onScroll}
              scrollEnabled={enableScroll}
              data={places}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No places found.
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleVote(item.id)}
                >
                  <View style={styles.iconLeft}>
                    <FontAwesome name="map-marker" size={20} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.voteCount}>
                      {votes[item.id] || 0} vote
                      {(votes[item.id] || 0) !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View style={styles.iconRight}>
                    {votedPlaceId === item.id ? (
                      <FontAwesome
                        name="check-circle"
                        size={20}
                        color="#007AFF"
                      />
                    ) : (
                      <FontAwesome name="circle-thin" size={20} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

export default BottomSheetVote;

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
    color: "#7a297a",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconLeft: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  voteCount: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  iconRight: {
    marginLeft: 12,
  },
});
