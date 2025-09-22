// /(owner)/Home/Pet Boarding/SelectPayment.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { mockBookings } from "@/services/boarding/mockBookings";

export default function SelectPayment() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const booking = mockBookings.find((b) => b.id === bookingId);

  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "PayPal" | null>(null);

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text>Booking not found</Text>
      </View>
    );
  }

  const handleProceed = () => {
    if (!paymentMethod) {
      Alert.alert("Please select a payment method.");
      return;
    }

    // Navigate to corresponding screen
    if (paymentMethod === "Cash") {
      router.push({
        pathname: "/(owner)/Home/payment/CashScreen",
        params: { bookingId },
      });
    } else if (paymentMethod === "PayPal") {
      router.push({
        pathname: "/(owner)/Home/payment/PayPalScreen",
        params: { bookingId },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Payment</Text>

      <View style={styles.card}>
        <Text style={styles.facility}>{booking.facility.name}</Text>
        <Text>Check-In: {booking.checkIn.toDateString()}</Text>
        <Text>Check-Out: {booking.checkOut.toDateString()}</Text>
        {booking.notes ? <Text>Notes: {booking.notes}</Text> : null}
        <Text>Status: {booking.status}</Text>
      </View>

      <Text style={styles.label}>Select Payment Method</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === "Cash" && styles.selected]}
          onPress={() => setPaymentMethod("Cash")}
        >
          <Text style={[styles.paymentText, paymentMethod === "Cash" && { color: "#fff" }]}>Cash</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === "PayPal" && styles.selected]}
          onPress={() => setPaymentMethod("PayPal")}
        >
          <Text style={[styles.paymentText, paymentMethod === "PayPal" && { color: "#fff" }]}>PayPal</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleProceed}>
        <Text style={styles.confirmButtonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center" },
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
  label: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  paymentOptions: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  paymentButton: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: "#ecf0f1", borderRadius: 12 },
  selected: { backgroundColor: "#27ae60" },
  paymentText: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
  confirmButton: { backgroundColor: "#e67e22", padding: 16, borderRadius: 12, alignItems: "center" },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
