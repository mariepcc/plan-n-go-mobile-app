import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  name: string;
};

export default function MemberRow({ name }: Props) {
  return (
    <View style={styles.item}>
      <FontAwesome name="user-o" size={20} color="#666" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    width: "100%",
  },
  icon: {
    color: "#666",
    marginRight: 30,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subTitle: {
    fontSize: 12,
    color: "#666",
  },
});
