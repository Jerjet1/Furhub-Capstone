import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomTabBarButton from "@/components/Buttons/CustomTabBarButton";
import React from "react";

export default function WalkerTabs() {
  const createScreenOptions = (title: any, iconName: any) => ({
    title,
    tabBarIcon: ({ color }: { color: any }) => (
      <FontAwesome name={iconName} size={20} color={color} />
    ),
    tabBarButton: (props: any) => <CustomTabBarButton {...props} />,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#512DA8",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: "#F9F8F9",
          height: 55,
          paddingBottom: 5,
        },
      }}>
      <Tabs.Screen name="Home" options={createScreenOptions("Home", "home")} />
      <Tabs.Screen
        name="Booking"
        options={createScreenOptions("Booking", "calendar")}
      />
    </Tabs>
  );
}
