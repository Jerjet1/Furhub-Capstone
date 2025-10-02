import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { mockBookings } from "@/services/boarding/mockBookings";

export default function Booking() {
  const [bookings, setBookings] = useState(mockBookings);

  const handleAccept = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Accepted" } : b))
    );
  };

  const handleDecline = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Declined" } : b))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🐾 Booking Requests</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: item.status === "Pending" ? "#fff" : "#F0F4F8" }]}>
            <View>
              <Text style={styles.petName}>{item.petName}</Text>
              <Text style={styles.owner}>Owner: {item.ownerName}</Text>
              <Text style={[styles.status, item.status === "Accepted" ? { color: "#2ECC71" } : item.status === "Declined" ? { color: "#E74C3C" } : { color: "#3498DB" }]}>
                {item.status}
              </Text>
            </View>
            {item.status === "Pending" && (
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.btn, { backgroundColor: "#2ECC71" }]} onPress={() => handleAccept(item.id)}>
                  <FontAwesome5 name="check" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { backgroundColor: "#E74C3C" }]} onPress={() => handleDecline(item.id)}>
                  <FontAwesome5 name="times" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F9F8F9" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15, color: "#34495E" },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petName: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  owner: { color: "#777", marginBottom: 5 },
  status: { fontWeight: "600" },
  buttons: { flexDirection: "row", gap: 10 },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
