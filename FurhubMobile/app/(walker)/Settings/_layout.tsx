import { View, Text } from "react-native";
import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingScreen" />
      <Stack.Screen name="AccountProfile" />
      <Stack.Screen name="WalkerProfile" />
    </Stack>
  );
}
