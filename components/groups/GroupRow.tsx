import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

type Props = {
  title: string;
};

export default function GroupRow({ title }: Props) {
  return (
    <View style={styles.item}>
      <FontAwesomeIcon icon={faPeopleGroup} size={24} style={styles.icon} />
      <View>
        <Text style={styles.title}>{title}</Text>
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
    color: "#0a1c6494",
    marginRight: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
  },
});
