import { Tabs, usePathname, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import { Image, View, Text } from "react-native";
import CustomTabBarButton from "@/components/Buttons/CustomTabBarButton";
import { mockNotifications } from "@/services/boarding/mockBookings";

export default function PetWalkerTabs({ walkerId }: { walkerId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const prevNotifications = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotifs = mockNotifications.filter(
        (n) => n.walkerId === walkerId && !prevNotifications.current.has(n.id)
      );

      if (newNotifs.length > 0) {
        newNotifs.forEach((n) => prevNotifications.current.add(n.id));
        setNotificationsCount((prev) => prev + newNotifs.length);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [walkerId]);

  const createScreenOptions = (title: string, iconName: string, resetRoute?: string, useLogo = false) => ({
    title,
    headerShown: false,
    tabBarIcon: ({ color }: { color: string }) =>
      useLogo ? (
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
          style={{ width: 22, height: 22 }}
        />
      ) : (
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
            if (title === "Notification") setNotificationsCount(0); // Reset on open
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
