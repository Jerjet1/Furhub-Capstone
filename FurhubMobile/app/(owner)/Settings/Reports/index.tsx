import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Reports() {
  const reports = [
    { title: "Booking Report", icon: "dog", color: "#3498DB", route: "/(owner)/Settings/Reports/BookingReport" },
    { title: "Subscription Report", icon: "paw", color: "#27AE60", route: "/(owner)//Settings/Reports/SubscriptionReport" },
    { title: "Transaction Report", icon: "file-invoice-dollar", color: "#E67E22", route: "/(owner)//Settings/Reports/TransactionReport" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Reports Dashboard</Text>

      <View style={styles.grid}>
        {reports.map((report, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: report.color }]}
            onPress={() => router.push(report.route)}
          >
            <FontAwesome5 name={report.icon as any} size={28} color="#fff" />
            <Text style={styles.cardText}>{report.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F9F8F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2C3E50",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  card: {
    width: 150,
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
