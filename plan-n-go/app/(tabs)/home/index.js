import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Page() {
  return (
    <View>
      <Stack.Screen options={{ headerShown: true, title: "Home" }} />
      <Text style={styles.title}>Upcoming meetings:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7a297a",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 15
  },
});
