import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function BookingReport() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🐶 Booking Report</Text>

      <View style={[styles.card, { backgroundColor: "#3498DB" }]}>
        <FontAwesome5 name="calendar-check" size={28} color="#fff" />
        <Text style={styles.cardText}>Total Bookings: 120</Text>
      </View>

      <View style={[styles.card, { backgroundColor: "#2ECC71" }]}>
        <FontAwesome5 name="check-circle" size={28} color="#fff" />
        <Text style={styles.cardText}>Completed: 95</Text>
      </View>

      <View style={[styles.card, { backgroundColor: "#E74C3C" }]}>
        <FontAwesome5 name="times-circle" size={28} color="#fff" />
        <Text style={styles.cardText}>Cancelled: 25</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: "center", backgroundColor: "#F9F8F9" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#2C3E50" },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: { marginTop: 10, fontSize: 18, fontWeight: "600", color: "#fff" },
});
