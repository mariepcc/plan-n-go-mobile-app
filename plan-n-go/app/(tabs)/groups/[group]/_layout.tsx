import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Stack, withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";


const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function GroupInfoLayout() {
  const { group: groupId } = useLocalSearchParams<{ group: string }>();
  const { name: groupName } = useLocalSearchParams<{ name: string }>();
  const { userId: userId } = useLocalSearchParams<{ userId: string }>();



  return (
    <><Stack.Screen
      options={{ title: groupName }} /><MaterialTopTabs id={undefined}>
        <MaterialTopTabs.Screen name="meetings" options={{ title: "Meetings" }} initialParams={{ groupId, userId }} />
        <MaterialTopTabs.Screen name="members" options={{ title: "Members" }} initialParams={{ groupId }} />
        <MaterialTopTabs.Screen name="costs" options={{ title: "Expenses" }} initialParams={{ groupId, userId }} />
      </MaterialTopTabs></>
  );
}