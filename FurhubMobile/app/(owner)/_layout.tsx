import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CustomTabBarButton from "@/components/CustomTabBarButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";

export default function OwnerTabs() {
  const insets = useSafeAreaInsets();
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
          // paddingTop: 5,
          paddingBottom: 5,
          // marginBottom: Platform.select({
          //   android: 43,
          //   ios: insets.bottom,
          // }),
          // elevation: 0,
          // shadowOpacity: 0, // Removes shadow on iOS
          backgroundColor: "#F9F8F9",
        },
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color="#512DA8" />
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
