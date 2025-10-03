import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { mockBookings } from "@/services/boarding/mockBookings";

export default function CashScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const booking = mockBookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text>Booking not found</Text>
      </View>
    );
  }

  const bill = booking.amount ?? 500;

  const handleConfirmCash = () => {
    booking.status = "Paid";
    booking.paymentMethod = "Cash";

    Alert.alert(
      "Payment Received ✅",
      `You have paid ₱${bill} in cash.`,
      [{ text: "OK", onPress: () => router.push("/(owner)/Bookinglist/BookingList") }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cash Payment</Text>

      <View style={styles.card}>
        <Text style={styles.facility}>{booking.facility.name}</Text>
        <Text>Check-In: {booking.checkIn.toDateString()}</Text>
        <Text>Check-Out: {booking.checkOut.toDateString()}</Text>
        <Text>Total Bill: ₱{bill}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirmCash}>
        <Text style={styles.buttonText}>Confirm Cash Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  facility: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  button: { backgroundColor: "#27ae60", padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
