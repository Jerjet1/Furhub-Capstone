import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getWalkerNotifications, updateBookingStatus, mockBookings } from "@/services/boarding/mockBookings";

export default function NotificationScreen({ walkerId }: { walkerId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notifs = getWalkerNotifications(walkerId).map((n) => {
      const booking = mockBookings.find((b) => b.id === n.bookingId);
      return { ...n, booking };
    });
    setNotifications(notifs);
  };

  const handleAction = (bookingId: string, action: "Approved" | "Cancelled") => {
    updateBookingStatus(bookingId, action);
    loadNotifications();
    Alert.alert(`Booking ${action}`);
  };

  const renderItem = ({ item }: { item: any }) => {
    const booking = item.booking;
    if (!booking) return null;

    return (
      <View style={styles.card}>
        {/* Booking Request Message */}
        <Text style={styles.message}>{item.message}</Text>

        {/* Booking Info */}
        <View style={styles.info}>
          <Text style={styles.infoText}>Facility: {booking.facility.name}</Text>
          <Text style={styles.infoText}>Check-In: {new Date(booking.checkIn).toLocaleDateString()}</Text>
          <Text style={styles.infoText}>Check-Out: {new Date(booking.checkOut).toLocaleDateString()}</Text>
          <Text style={styles.infoText}>Amount: ${booking.amount}</Text>
          {booking.notes ? <Text style={styles.infoText}>Notes: {booking.notes}</Text> : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#34D399" }]}
            onPress={() => handleAction(item.bookingId, "Approved")}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#F87171" }]}
            onPress={() => handleAction(item.bookingId, "Cancelled")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F9FAFB" }}>
      <Text style={styles.title}>Booking Requests</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No new booking requests</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#111" },
  emptyText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 50 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  message: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#111" },
  info: { marginBottom: 15 },
  infoText: { fontSize: 15, color: "#555", marginBottom: 3 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
