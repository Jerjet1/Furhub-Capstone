import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Subscription() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Subscription</Text>
      <Text style={styles.subtitle}>Manage your subscription plan</Text>

      {/* Subscription Card */}
      <View style={styles.card}>
        <Text style={styles.planName}>Premium Plan</Text>
        <Text style={styles.planPrice}>₱499 / month</Text>
        <Text style={styles.planDetails}>✔ Unlimited Bookings</Text>
        <Text style={styles.planDetails}>✔ Priority Support</Text>
        <Text style={styles.planDetails}>✔ Exclusive Pet Care Tips</Text>
      </View>

      {/* Renew Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(owner)/Home/Payments/PaymentFlow")}
      >
        <Text style={styles.buttonText}>Renew Subscription</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#333" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  planName: { fontSize: 18, fontWeight: "600", color: "#222", marginBottom: 4 },
  planPrice: { fontSize: 16, fontWeight: "bold", color: "#4CAF50", marginBottom: 12 },
  planDetails: { fontSize: 14, color: "#555", marginBottom: 4 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
