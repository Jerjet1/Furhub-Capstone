import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";

export default function WalkerTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#888",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0, // Removes shadow on iOS
          backgroundColor: "#666666",
          height: 54,
          paddingBottom: 27,
          // marginBottom: Platform.select({
          //   android: 43,
          //   ios: insets.bottom,
          // }),
        },
      }}>
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
    </Tabs>
  );
}
