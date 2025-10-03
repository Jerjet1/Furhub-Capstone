import React from "react";
import { Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

const createScreenOptions = (
  title: string,
  icon: keyof typeof Ionicons.glyphMap
) => ({
  title,
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={icon} size={size} color={color} />
  ),
  headerShown: false,
});

export default function WalkerLayout() {
  const pathname = usePathname();

  // ✅ Hide tabs only on Settings inner screens
  const hideTabs =
    pathname?.toLowerCase().startsWith("/settings/") &&
    pathname.toLowerCase() !== "/settings";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: hideTabs
          ? { display: "none" }
          : {
              position: "absolute",
              bottom: 15,
              left: 15,
              right: 15,
              elevation: 5,
              backgroundColor: "#fff",
              borderRadius: 25,
              height: 65,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              borderTopWidth: 0,
              paddingBottom: Platform.OS === "ios" ? 20 : 8,
            },
      }}
    >
      <Tabs.Screen
        name="booking"
        options={createScreenOptions("Booking", "calendar")}
      />
      <Tabs.Screen
        name="chat"
        options={createScreenOptions("Chat", "chatbubbles")}
      />
      <Tabs.Screen
        name="notifications"
        options={createScreenOptions("Notification", "notifications")}
      />
      <Tabs.Screen
        name="settings"
        options={createScreenOptions("Settings", "cog")}
      />
    </Tabs>
  );
}
