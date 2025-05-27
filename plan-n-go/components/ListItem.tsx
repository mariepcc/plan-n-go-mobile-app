import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

type Props = {
  title: string;
  subTitle?: string;
};

export default function ListItem({ title, subTitle }: Props) {
  return (
    <View style={styles.item}>
      <FontAwesomeIcon icon={faUserGroup} size={24} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
      <FontAwesome name="plus" size={20} color="#666" style={styles.icon} />
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
    width: "100%"
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
