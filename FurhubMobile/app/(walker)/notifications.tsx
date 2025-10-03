// walkernotifications.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getWalkerNotifications } from "@/services/boarding/mockBookings";

export default function WalkerNotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const walkerId = "walker123"; // 🔑 Replace with logged-in walker

  useEffect(() => {
    const interval = setInterval(() => {
      const latest = getWalkerNotifications(walkerId).sort(
        (a, b) => b.id - a.id
      );
      setNotifications(latest);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <Text>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  notificationCard: {
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  time: { fontSize: 12, color: "#666" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#999" },
});
