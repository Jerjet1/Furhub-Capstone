import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { getWalkerBookings } from "@/services/boarding/mockBookings";
import { WebView } from "react-native-webview";

export default function BookingScreen({ walkerId }: { walkerId: string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const bks = getWalkerBookings(walkerId);
    setBookings(bks);
  };

  const handleViewLocation = (location: { latitude: number; longitude: number }) => {
    if (!location || !location.latitude || !location.longitude) {
      return alert("Location not available");
    }
    console.log("Map coordinates:", location.latitude, location.longitude); // Debug
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.facility.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === "Approved" ? "#34D399" : "#FBBF24" },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Check-In: {new Date(item.checkIn).toLocaleDateString()}
        </Text>
        <Text style={styles.infoText}>
          Check-Out: {new Date(item.checkOut).toLocaleDateString()}
        </Text>
        <Text style={styles.infoText}>Amount: ${item.amount}</Text>
        {item.notes ? <Text style={styles.infoText}>Notes: {item.notes}</Text> : null}
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => handleViewLocation(item.facility.location)}
      >
        <Text style={styles.locationButtonText}>View Location</Text>
      </TouchableOpacity>
    </View>
  );

  const getMapHtml = (lat: number, lng: number) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <style>
          html, body { margin:0; padding:0; height:100%; }
          #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([${lat}, ${lng}], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          L.marker([${lat}, ${lng}]).addTo(map)
            .bindPopup('Walker Location')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F9FAFB" }}>
      <Text style={styles.title}>Your Bookings</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookings yet</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ padding: 15, backgroundColor: "#3B82F6" }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Close Map</Text>
          </TouchableOpacity>

          {selectedLocation && (
            <WebView
              originWhitelist={["*"]}
              source={{ html: getMapHtml(selectedLocation.latitude, selectedLocation.longitude) }}
              style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height - 60 }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#111" },
  emptyText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 50 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  name: { fontSize: 18, fontWeight: "bold", color: "#111" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 },
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  info: { marginBottom: 15 },
  infoText: { fontSize: 15, color: "#555", marginBottom: 3 },
  locationButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  locationButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
