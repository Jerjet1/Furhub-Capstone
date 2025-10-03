import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Only the main HomeScreen index */}
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
