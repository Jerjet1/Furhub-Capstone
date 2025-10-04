import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { mockNotifications } from "@/services/walkers/mockNotifications";

export default function Notification() {
  const [notifications] = useState(mockNotifications);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F9F8F9" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15, color: "#34495E" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  message: { fontSize: 16 },
  time: { color: "#777", marginTop: 5, fontSize: 12 },
});
