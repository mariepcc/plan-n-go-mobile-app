import { View, Text, StyleSheet, Image } from "react-native";
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
      <Image
        source={require("../../assets/plus.png")}
        style={styles.icon}
        resizeMode="contain"
      />
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
    width: 30,
    height: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 12,
    color: "#666",
    marginLeft: 10,
  },
});
