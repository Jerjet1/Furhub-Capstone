import { Stack } from "expo-router";

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "MessageHub" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "Chat" }} />
    </Stack>
  );
}


