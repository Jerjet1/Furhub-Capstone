import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function OwnerBookingReport() {
  const reportData = [
    { title: "Total Bookings", icon: "calendar-check", count: 40, color: "#3498DB" },
    { title: "Pending", icon: "clock", count: 8, color: "#F39C12" },
    { title: "Completed", icon: "check-circle", count: 28, color: "#2ECC71" },
    { title: "Cancelled", icon: "times-circle", count: 4, color: "#E74C3C" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.header}>🐶 Owner Booking Report</Text>

      <View style={styles.cardsContainer}>
        {reportData.map((item, index) => (
          <View key={index} style={[styles.card, { backgroundColor: item.color }]}>
            <FontAwesome5 name={item.icon as any} size={32} color="#fff" />
            <Text style={styles.count}>{item.count}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#34495E",
    marginBottom: 20,
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 140,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  count: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 6,
    textAlign: "center",
  },
});
