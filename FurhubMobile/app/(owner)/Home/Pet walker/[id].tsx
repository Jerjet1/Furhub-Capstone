// /(owner)/Home/WalkerProfile/[id].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cebuWalkers } from "@/services/walkers/walkers";
import { FontAwesome5 } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

export default function WalkerProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const walker = cebuWalkers.find((w) => w.id === id);
  const [mapVisible, setMapVisible] = useState(false);

  if (!walker) {
    return (
      <View style={styles.center}>
        <Text>Walker not found.</Text>
      </View>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/?mlat=${walker.lat}&mlon=${walker.long}#map=18/${walker.lat}/${walker.long}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Image */}
      <Image source={{ uri: walker.image }} style={styles.image} />

      {/* Walker Info */}
      <View style={styles.card}>
        <Text style={styles.title}>{walker.name}</Text>
        <Text style={styles.rating}>
          ⭐ {walker.rating.toFixed(1)} ({walker.reviews} reviews)
        </Text>
        <View style={styles.row}>
          <FontAwesome5 name="money-bill-wave" size={18} color="#27ae60" />
          <Text style={styles.price}> ₱{walker.pricePerHour}/hour</Text>
        </View>
        <Text style={styles.description}>
          Experienced pet walker providing personalized care for your furry
          friends.
        </Text>
      </View>

      {/* Services Offered */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Services Offered</Text>
        {walker.services.map((s, idx) => (
          <View key={idx} style={styles.row}>
            <FontAwesome5 name="paw" size={16} color="#3498db" />
            <Text style={styles.listItem}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Location</Text>
        <View style={styles.row}>
          <FontAwesome5 name="map-marker-alt" size={18} color="#e74c3c" />
          <Text style={styles.location}>
            {walker.barangay}, {walker.city}, {walker.province}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setMapVisible(true)}
        >
          <FontAwesome5 name="map" size={16} color="#fff" />
          <Text style={styles.mapButtonText}>View on Map</Text>
        </TouchableOpacity>
      </View>

      {/* Book Now Button */}
      <TouchableOpacity
        style={styles.bookingButton}
        onPress={() => router.push(`/(owner)/Home/Pet walker/request?id=${walker.id}`)}
      >
        <FontAwesome5 name="calendar-check" size={18} color="#fff" />
        <Text style={styles.bookingButtonText}>Book Now</Text>
      </TouchableOpacity>

      {/* Map Modal */}
      <Modal visible={mapVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📍 {walker.name}</Text>
              <TouchableOpacity onPress={() => setMapVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <WebView
              originWhitelist={["*"]}
              source={{ uri: mapUrl }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              scalesPageToFit
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 220, borderRadius: 16, marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6, color: "#2c3e50" },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#34495e" },
  rating: { fontSize: 14, color: "#666", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  price: { fontSize: 16, fontWeight: "600", marginLeft: 8, color: "#27ae60" },
  location: { fontSize: 15, marginLeft: 8, color: "#333" },
  description: { fontSize: 14, color: "#555", marginTop: 8 },
  listItem: { fontSize: 15, marginLeft: 8, color: "#555" },
  mapButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  mapButtonText: { color: "#fff", fontSize: 15, fontWeight: "600", marginLeft: 6 },
  bookingButton: {
    flexDirection: "row",
    backgroundColor: "#e67e22",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  bookingButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    height: height * 0.75,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#f5f5f5ff",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 16,
  },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  closeText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  webview: { flex: 1 },
});
