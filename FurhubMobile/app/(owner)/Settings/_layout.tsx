import { View, Text } from "react-native";
import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SettingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AccountProfile" options={{ headerShown: false }} />
      <Stack.Screen name="PetProfile" options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" options={{ headerShown: false }} />
    </Stack>
  );
}
