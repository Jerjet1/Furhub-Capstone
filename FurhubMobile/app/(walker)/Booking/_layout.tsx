import { View, Text, StatusBar } from "react-native";
import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <>
      {/* Make sure the status bar is visible and dark text */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true} // so content doesn’t cover it
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Booking" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
