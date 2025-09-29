import { Tabs, usePathname } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomTabBarButton from "@/components/Buttons/CustomTabBarButton";
import React from "react";
export default function OwnerTabs() {
  const pathname = usePathname();

  const createScreenOptions = (title: any, iconName: any) => ({
    title,
    tabBarIcon: ({ color }: { color: any }) => (
      <FontAwesome name={iconName} size={20} color={color} />
    ),
    tabBarButton: (props: any) => <CustomTabBarButton {...props} />,
  });

  // ✅ hide only if deeper than SettingScreen
  const isSettingsRoot =
    pathname === "/Settings" || pathname === "/Settings/SettingScreen";

  const hideTabs = pathname?.startsWith("/Settings/") && !isSettingsRoot;

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
        tabBarStyle: hideTabs
          ? { display: "none" }
          : {
              height: 55,
              paddingBottom: 5,
              backgroundColor: "#F9F8F9",
            },
      }}>
      <Tabs.Screen name="Home" options={createScreenOptions("Home", "home")} />
      <Tabs.Screen
        name="Community"
        options={createScreenOptions("Community", "users")}
      />
      <Tabs.Screen
        name="Search"
        options={createScreenOptions("Search", "search")}
      />
      <Tabs.Screen
        name="Reviews"
        options={createScreenOptions("Reviews", "star")}
      />
      <Tabs.Screen
        name="Settings"
        options={createScreenOptions("Settings", "gear")}
      />
    </Tabs>
  );
}
