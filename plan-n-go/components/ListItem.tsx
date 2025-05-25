import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  title: string;
  subTitle?: string;
};

export default function ListItem({ title, subTitle }: Props) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
      </View>
      <FontAwesome name="plus" size={20} color="#666" />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
