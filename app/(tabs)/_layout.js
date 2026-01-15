import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#421010",
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              style={{ marginBottom: -3 }}
              name="home"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          tabBarLabel: "Groups",
          title: "Groups",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={22}
              style={{ marginBottom: -3 }}
              name="group"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarLabel: "Friends",
          title: "Friends",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={22}
              style={{ marginBottom: -3 }}
              name="heart"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: "Account",
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={22}
              style={{ marginBottom: -3 }}
              name="user"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
