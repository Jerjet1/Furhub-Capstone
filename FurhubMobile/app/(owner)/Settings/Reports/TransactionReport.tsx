import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TransactionReport() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💵 Transaction Report</Text>

      <View style={[styles.card, { backgroundColor: "#2980B9" }]}>
        <FontAwesome5 name="money-bill-wave" size={28} color="#fff" />
        <Text style={styles.cardText}>Total Revenue: ₱50,000</Text>
      </View>

      <View style={[styles.card, { backgroundColor: "#27AE60" }]}>
        <FontAwesome5 name="credit-card" size={28} color="#fff" />
        <Text style={styles.cardText}>Successful Payments: 80</Text>
      </View>

      <View style={[styles.card, { backgroundColor: "#C0392B" }]}>
        <FontAwesome5 name="exclamation-triangle" size={28} color="#fff" />
        <Text style={styles.cardText}>Failed Payments: 5</Text>
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
