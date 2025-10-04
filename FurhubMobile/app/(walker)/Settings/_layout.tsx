import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingScreen" />
      <Stack.Screen name="AccountProfile" />
      <Stack.Screen name="WalkerProfile" />
      <Stack.Screen name="ViewReviews" />
      <Stack.Screen name="Reports" />
    </Stack>
  );
}
