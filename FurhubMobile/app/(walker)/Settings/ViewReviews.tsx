import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewReviews() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>View Reviews</Text>
      <Text style={styles.subtitle}>
        Here you can see feedback and ratings from pet owners.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
});
