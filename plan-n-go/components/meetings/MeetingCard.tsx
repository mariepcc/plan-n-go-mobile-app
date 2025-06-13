import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MeetingCard({
  title,
  date,
  places,
  userId,
  onAddPlace,
  onVote,
}: {
  title: string;
  date: Date;
  places?: { id: string; name: string }[];

  userId: string;
  onAddPlace: () => void;
  onVote: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.titleHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleText}>{title}</Text>
          <View>
            <Text style={styles.datePreview}>
              {format(date, "MMMM d, yyyy h:mm a")}
            </Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={22}
          color="#7a297a"
        />
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.divider} />
          <Text style={styles.placesText}>Places ideas: </Text>
          {places.length > 0 && (
            <View style={{ marginTop: 1 }}>
              {places.length > 0 && (
                <View style={{ marginTop: 2 }}>
                  {places.map((place) => (
                    <Text key={place.id} style={styles.datePreview}>
                      - {place.name}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.input} onPress={onAddPlace}>
              Suggest a new spot
            </Text>
            <FontAwesomeIcon
              icon={faLocationDot}
              size={18}
              style={styles.locIcon}
            />
          </View>
          <TouchableOpacity style={styles.voteButton} onPress={onVote}>
            <Text style={styles.voteButtonText}>Vote</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6F0FA",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#d0dce8",
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 15,
    fontSize: 14,
    backgroundColor: "#e6e6e6",
    color: "#666"
  },

  locIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
    color: "#888",
  },
  titleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#7a297a",
  },
  placesText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#7a297a",
  },
  datePreview: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 6,
    marginBottom: 20,
    opacity: 0.6,
  },
  dateRow: {
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedDate: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  icon: {
    marginLeft: 8,
    color: "#fff",
  },
  voteButton: {
    marginTop: 15,
    backgroundColor: "#5A505F",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  voteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
