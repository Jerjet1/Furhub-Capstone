import { Tabs, usePathname, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import CustomTabBarButton from "@/components/Buttons/CustomTabBarButton";
import { getWalkerNotifications, mockNotifications } from "@/services/boarding/mockBookings";

export default function PetWalkerTabs({ walkerId }: { walkerId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsCount, setNotificationsCount] = useState(0);

  // Watch notifications reactively
  useEffect(() => {
    const interval = setInterval(() => {
      const notifs = getWalkerNotifications(walkerId);
      setNotificationsCount(notifs.length);
    }, 500);

    return () => clearInterval(interval);
  }, [walkerId]);

  const createScreenOptions = (title: string, iconName: string, resetRoute?: string) => ({
    title,
    headerShown: false,
    tabBarIcon: ({ color }: { color: string }) => (
      <View>
        <FontAwesome5 name={iconName as any} size={20} color={color} />
        {title === "Notification" && notificationsCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -4,
              right: -10,
              backgroundColor: "red",
              borderRadius: 8,
              minWidth: 16,
              height: 16,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 2,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
              {notificationsCount}
            </Text>
          </View>
        )}
      </View>
    ),
    tabBarButton: (props: any) => (
      <CustomTabBarButton
        {...props}
        onPress={() => {
          if (resetRoute) {
            router.replace(resetRoute);
          } else {
            if (title === "Notification") setNotificationsCount(0);
            props.onPress?.();
          }
        }}
      />
    ),
  });

  const hideTabs = pathname?.startsWith("/Settings/") && pathname !== "/Settings";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
        tabBarStyle: hideTabs
          ? { display: "none" }
          : { height: 65, paddingBottom: 5, backgroundColor: "#fff", borderTopWidth: 0.5, borderTopColor: "#ddd" },
      }}
    >
      <Tabs.Screen name="Home" options={createScreenOptions("Home", "home")} />
      <Tabs.Screen name="Bookinglist" options={createScreenOptions("Bookings", "book-open")} />
      <Tabs.Screen name="Notification" options={createScreenOptions("Notification", "bell")} />
      <Tabs.Screen name="Settings" options={createScreenOptions("Settings", "cog")} />
    </Tabs>
  );
}
