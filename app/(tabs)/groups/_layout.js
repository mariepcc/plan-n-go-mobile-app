import { Stack } from "expo-router";
import { NotificationsProvider } from "../../../hooks/useNotifications";

export default function GroupsLayout() {
  return (
    <NotificationsProvider>
      <Stack />
    </NotificationsProvider>
  );
}
