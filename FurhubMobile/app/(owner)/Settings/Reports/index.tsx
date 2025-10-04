import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Reports() {
  const reports = [
    { title: "Booking Report", icon: "dog", color: "#3498DB", route: "/(owner)/Settings/Reports/BookingReport" },
    { title: "Subscription Status", icon: "paw", color: "#27AE60", route: "/(owner)/Settings/Reports/SubscriptionReport" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Reports Dashboard</Text>

      <View style={styles.cardsContainer}>
        {reports.map((report, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: report.color }]}
            onPress={() => router.push(report.route)}
          >
            <FontAwesome5 name={report.icon as any} size={32} color="#fff" />
            <Text style={styles.cardTitle}>{report.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
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
  cardTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
