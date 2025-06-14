import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

const CustomCard = ({ item, x, index, size, spacer }) => {
  const style = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [(index - 2) * size, (index - 1) * size, index * size],
      [0.8, 1, 0.8]
    );
    return {
      transform: [{ scale }],
    };
  });

  if (!item.title) {
    return <View style={{ width: spacer }} key={index} />;
  }

  return (
    <View style={{ width: size }} key={index}>
      <Animated.View style={[style]}>
        <LinearGradient
          colors={["#ffecd2", "#fcb69f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            {item.description || "No description"}
          </Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 180,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
});
