import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/useAuth";

export default function SettingScreen() {
  const { logout, user, setActiveRole } = useAuth();

  const hasWalkerRole = user?.roles.includes("walker");
  const switcherRole = () => {
    if (hasWalkerRole) {
      setActiveRole("walker");
    } else {
      console.log("wanna become a walker role?");
    }
  };

  return (
    <LinearGradient
      colors={["#F9FAFB", "#F9FAFB"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        {/* Cute Header */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png" }}
            style={{ width: 80, height: 80, marginBottom: 10 }}
          />
        </View>

        {/* Account Profile */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#FBBF24" }]}
          onPress={() => router.push("/(owner)/Settings/AccountProfile")}
        >
          <View style={styles.cardContent}>
            <Ionicons name="person-circle" size={28} color="#f97316" />
            <Text style={styles.cardText}>Account Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#f97316" />
        </TouchableOpacity>

        {/* Pet Profile */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#34D399" }]}
          onPress={() => router.push("/(owner)/Settings/PetProfile")}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="dog" size={28} color="#16a34a" />
            <Text style={styles.cardText}>Pet Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#16a34a" />
        </TouchableOpacity>

        {/* Reports */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#9B59B6" }]}
          onPress={() => router.push("/(owner)/Settings/Reports")}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="chart-line" size={28} color="#8e44ad" />
            <Text style={styles.cardText}>Reports</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#8e44ad" />
        </TouchableOpacity>

        {/* Walker Role */}
        <TouchableOpacity
          style={[styles.card, { borderColor: "#F472B6" }]}
          onPress={switcherRole}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="paw" size={28} color="#e11d48" />
            <Text style={styles.cardText}>
              {hasWalkerRole ? "Switch to Walker" : "Become a Walker"}
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
