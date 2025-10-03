import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

type Booking = {
  id: string;
  walker: string;
  service: string;
  date: string;
  status: "Completed";
};

// Sample completed bookings
const completedBookings: Booking[] = [
  { id: "1", walker: "Jane Smith", service: "Pet Boarding (Overnight)", date: "Sept 22, 2025 - 6:00 PM", status: "Completed" },
  { id: "2", walker: "Alex Brown", service: "Cat Sitting (2 hrs)", date: "Sept 25, 2025 - 3:00 PM", status: "Completed" },
];

export default function CompletedBooking() {
  const renderItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/Home/BookingDetail", { bookingId: item.id })}
    >
      <View style={styles.headerRow}>
        <Text style={styles.walker}>{item.walker}</Text>
        <Text style={[styles.status, { color: "#27AE60" }]}>{item.status}</Text>
      </View>
      <Text style={styles.service}>{item.service}</Text>
      <View style={styles.row}>
        <FontAwesome5 name="calendar-alt" size={14} color="#555" />
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Completed Bookings</Text>
      <FlatList
        data={completedBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F8F9", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 15, color: "#2C3E50", textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 4 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  walker: { fontSize: 18, fontWeight: "600", color: "#333" },
  status: { fontSize: 14, fontWeight: "600" },
  service: { fontSize: 16, color: "#555", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  date: { marginLeft: 6, fontSize: 14, color: "#777" },
});
