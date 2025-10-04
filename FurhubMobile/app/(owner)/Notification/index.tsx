// ownernotifications.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
import { getOwnerNotifications } from "@/services/boarding/mockBookings";
import { router } from "expo-router";

export default function OwnerNotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);
  const ownerId = "owner123"; // 🔑 Replace with logged-in owner

  // Load notification sound
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/notifications.mp3")
        );
        soundRef.current = sound;
      } catch (e) {
        console.log("Error loading sound:", e);
      }
    };
    loadSound();
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const playNotificationSound = async () => {
    try {
      if (soundRef.current) await soundRef.current.replayAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  // Poll notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const latest = getOwnerNotifications(ownerId).sort(
        (a, b) => b.id - a.id
      );
      if (latest.length > notifications.length) {
        playNotificationSound();
      }
      setNotifications(latest);
    }, 2000);
    return () => clearInterval(interval);
  }, [notifications]);

  const handlePress = (item: any) => {
    Alert.alert("Notification", item.message, [
      {
        text: "View",
        onPress: () =>
          router.push({
            pathname: "/(owner)/Bookinglist",
            params: { bookingId: item.bookingId },
          }),
      },
      { text: "Close" },
    ]);
  };

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.notificationCard}
              onPress={() => handlePress(item)}
            >
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.dateTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  notificationCard: {
    backgroundColor: "#EAF4FF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  message: { fontSize: 14, color: "#2c3e50", marginBottom: 4 },
  dateTime: { fontSize: 12, color: "#666" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#999" },
});
