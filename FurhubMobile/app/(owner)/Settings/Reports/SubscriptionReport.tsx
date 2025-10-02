import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

type SubscriptionStatus = "Active" | "Expiring Soon" | "Cancelled";

export default function OwnerSubscriptionReport() {
  // Example: Only one subscription status for the owner
  const subscription: { status: SubscriptionStatus; icon: string; color: string } = {
    status: "Active", // Change to "Expiring Soon" or "Cancelled" as needed
    icon: "user-check",
    color: "#27AE60",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🐾 Your Subscription</Text>

      <View style={[styles.card, { backgroundColor: subscription.color }]}>
        <FontAwesome5 name={subscription.icon as any} size={28} color="#fff" />
        <Text style={styles.status}>{subscription.status}</Text>
        <Text style={styles.info}>
          {subscription.status === "Active"
            ? "You can access all features!"
            : subscription.status === "Expiring Soon"
            ? "Renew soon to maintain access."
            : "Your subscription has been cancelled."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2C3E50",
  },
  card: {
    width: "95%",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  status: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  info: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },
});
