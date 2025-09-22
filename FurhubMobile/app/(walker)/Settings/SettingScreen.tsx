import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "@/context/useAuth";
import { router } from "expo-router";

export default function SettingsScreen() {
  const { logout, user, setActiveRole } = useAuth();

  const hasOwnerRole = user?.roles.includes("owner");
  const switcherRole = () => {
    if (hasOwnerRole) {
      setActiveRole("owner");
    } else {
      console.log("wanna become an owner?");
    }
  };

  return (
    <LinearGradient colors={["#F9FAFB", "#F9FAFB"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png" }}
            style={{ width: 80, height: 80, marginBottom: 10 }}
          />
        </View>

        {/* Account Profile */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#FBBF24" }]}
          onPress={() => router.push("/(walker)/Settings/AccountProfile")}
        >
          <View style={styles.cardContent}>
            <Ionicons name="person-circle" size={28} color="#f97316" />
            <Text style={styles.cardText}>Account Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#f97316" />
        </TouchableOpacity>

        {/* Walker Profile */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#34D399" }]}
          onPress={() => router.push("/(walker)/Settings/WalkerProfile")}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="user" size={28} color="#16a34a" />
            <Text style={styles.cardText}>Walker Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#16a34a" />
        </TouchableOpacity>

        {/* Switch Role */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#F472B6" }]}
          onPress={switcherRole}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="exchange-alt" size={28} color="#e11d48" />
            <Text style={styles.cardText}>
              {hasOwnerRole ? "Switch to Owner" : "Become Owner"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#e11d48" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#D1D5DB" }]}
          onPress={logout}
        >
          <View style={styles.cardContent}>
            <Ionicons name="log-out-outline" size={28} color="#6b7280" />
            <Text style={styles.cardText}>Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6b7280" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderRadius: 30,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
