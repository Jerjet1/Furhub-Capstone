import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomTabBarButton from "@/components/Buttons/CustomTabBarButton";
import React from "react";
export default function OwnerTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF", // active color sa tabs
        tabBarInactiveTintColor: "#512DA8", //inactive color sa tabs
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarStyle: {
          height: 55,
          paddingBottom: 5,
          backgroundColor: "#F9F8F9",
        },
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="Community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={20} color={color} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={20} color={color} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="gear" size={20} color={color} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
    </Tabs>
  );
}
