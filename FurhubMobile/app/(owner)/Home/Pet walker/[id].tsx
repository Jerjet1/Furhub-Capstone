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
  FlatList,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cebuWalkers } from "@/services/walkers/walkers";
import { FontAwesome5 } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { mockReviews } from "@/services/walkers/mockReviews";

export default function WalkerProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const walker = cebuWalkers.find((w) => w.id === id);

  const [mapVisible, setMapVisible] = useState(false);
  const [routeVisible, setRouteVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!walker) {
    return (
      <View style={styles.center}>
        <Text>Walker not found.</Text>
      </View>
    );
  }

  const zoom = 18;
  const mapUrl = `https://www.openstreetmap.org/?mlat=${walker.lat}&mlon=${walker.long}#map=${zoom}/${walker.lat}/${walker.long}`;

  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);

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
        <Text style={styles.description}>{walker.description}</Text>
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Location</Text>
        <View style={styles.row}>
          <FontAwesome5 name="map-marker-alt" size={18} color="#e74c3c" />
          <Text style={styles.location}>
            {walker.street}, {walker.barangay}, {walker.city}, {walker.province}
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

      {/* Routes */}
      {walker.routes && walker.routes.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.subtitle}>Available Routes</Text>
          <TouchableOpacity
            style={styles.routeButton}
            onPress={() => setRouteVisible(true)}
          >
            <FontAwesome5 name="route" size={16} color="#fff" />
            <Text style={styles.routeButtonText}>
              {selectedRoute ? `Selected: ${selectedRoute}` : "Choose Route"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Book Now below routes */}
<TouchableOpacity
  style={styles.bookingButton}
  onPress={() => {
    if (!selectedRoute) {
      // Alert if no route selected
      Alert.alert(
        "No Route Selected",
        "Please select a route before booking.",
        [{ text: "OK" }]
      );
      return;
    }

    // Navigate to booking page with selected route
    router.push(
      `/(owner)/Home/Pet walker/request?id=${walker.id}&route=${selectedRoute}`
    );
  }}
>
        <FontAwesome5 name="calendar-check" size={18} color="#fff" />
        <Text style={styles.bookingButtonText}>Book Now</Text>
      </TouchableOpacity>

      {/* Reviews (scrollable with view more) */}
      <View style={[styles.card, { padding: 0 }]}>
        <Text style={[styles.subtitle, { padding: 16 }]}>Reviews</Text>
<FlatList
  data={displayedReviews}
  keyExtractor={(item) => item.id}
  showsVerticalScrollIndicator={false}
  scrollEnabled={true}  // enable scroll for FlatList
  renderItem={({ item }) => (
    <View style={styles.reviewItem}>
      <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewName}>{item.name}</Text>
          <Text style={styles.reviewRating}>⭐ {item.rating}</Text>
        </View>
        <Text style={styles.reviewComment}>{item.comment}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
    </View>
  )}
/>

        {mockReviews.length > 3 && (
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => setShowAllReviews(!showAllReviews)}
          >
            <Text style={styles.viewMoreText}>
              {showAllReviews ? "View Less Reviews" : "View More Reviews"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

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

      {/* Route Selection Modal */}
      <Modal visible={routeVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🚶 Select a Route</Text>
              <TouchableOpacity onPress={() => setRouteVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={walker.routes}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.routeOption,
                    selectedRoute === item.name && styles.routeOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedRoute(item.name);
                    setRouteVisible(false);
                  }}
                >
                  <FontAwesome5 name="map-signs" size={16} color="#2c3e50" />
                  <Text style={styles.routeText}>{item.name}</Text>
                </TouchableOpacity>
              )}
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
  rating: { fontSize: 14, color: "#666", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  price: { fontSize: 16, fontWeight: "600", marginLeft: 8, color: "#27ae60" },
  location: { fontSize: 15, marginLeft: 8, color: "#333", flexShrink: 1 },
  description: { fontSize: 14, color: "#555", marginTop: 6, lineHeight: 20 },
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
  routeButton: {
    flexDirection: "row",
    backgroundColor: "#8e44ad",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  routeButtonText: { color: "#fff", fontSize: 15, fontWeight: "600", marginLeft: 6 },
  bookingButton: {
    flexDirection: "row",
    backgroundColor: "#e67e22",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  bookingButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
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
  routeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  routeOptionSelected: { backgroundColor: "#ecf0f1" },
  routeText: { fontSize: 16, marginLeft: 8, color: "#2c3e50" },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  reviewAvatar: { width: 50, height: 50, borderRadius: 25 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  reviewName: { fontWeight: "600", fontSize: 15, color: "#2c3e50" },
  reviewRating: { fontSize: 14, color: "#f39c12" },
  reviewComment: { fontSize: 14, color: "#555" },
  reviewDate: { fontSize: 12, color: "#888", marginTop: 2 },
  viewMoreButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f1f1f1",
  },
  viewMoreText: { color: "#007AFF", fontWeight: "600", fontSize: 15 },
});
