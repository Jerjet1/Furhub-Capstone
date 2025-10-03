import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { boardings } from "@/services/boarding/boardings";
import { cebuWalkers } from "@/services/walkers/walkers";

// Categories
const categories = [
  { id: "1", name: "Boarding", icon: "home" },
  { id: "2", name: "Walker", icon: "walking" },
];

// Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Merge boardings + walkers
const services = [
  ...boardings.map((b) => ({
    id: b.id,
    name: b.name,
    image: b.image,
    reviews: b.reviews,
    rating: b.rating,
    price: `₱${b.pricePerNight}/night`,
    distance: `${b.barangay}, ${b.city}`,
    category: "Boarding",
    lat: b.lat,
    long: b.long,
  })),
  ...cebuWalkers.map((w) => ({
    id: w.id,
    name: w.name,
    image: w.image,
    reviews: w.reviews,
    rating: w.rating,
    price: `₱${w.pricePerHour}/hour •`,
    distance: `${w.barangay}, ${w.city}`,
    category: "Walker",
    lat: w.lat,
    long: w.long,
    routes: w.routes,
  })),
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Boarding");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const router = useRouter();

  // Watch user location
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        setLoadingLocation(false);
        return;
      }

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          setLoadingLocation(false);
        }
      );
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Filter & sort services by distance
  const filteredServices = useMemo(() => {
    let filtered = services
      .filter((s) => s.category === activeCategory)
      .filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((s) => {
        if (userLocation) {
          const km = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            s.lat,
            s.long
          );
          return { ...s, computedDistance: km };
        }
        return { ...s, computedDistance: null };
      });

    // Sort by nearest first
    filtered.sort((a, b) => {
      if (a.computedDistance == null) return 1;
      if (b.computedDistance == null) return -1;
      return a.computedDistance - b.computedDistance;
    });

    return filtered;
  }, [userLocation, activeCategory, searchQuery]);

  if (loadingLocation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Find a loving sitter..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() =>
            router.push({
              pathname: "/(owner)/Home/SearchLocation",
              params: { category: activeCategory },
            })
          }
        >
          <FontAwesome5 name="map-marker-alt" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.category,
              cat.name === activeCategory && styles.activeCategory,
            ]}
            onPress={() => setActiveCategory(cat.name)}
          >
            <FontAwesome5
              name={cat.icon as any}
              size={16}
              color={cat.name === activeCategory ? "#007AFF" : "#666"}
            />
            <Text
              style={[
                styles.categoryText,
                cat.name === activeCategory && styles.activeCategoryText,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{activeCategory} Services Nearby</Text>

      {filteredServices.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
          No services found.
        </Text>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                if (item.category === "Walker") {
                  router.push(`/(owner)/Home/Pet walker/${item.id}`);
                } else {
                  router.push(`/(owner)/Home/Pet Boarding/${item.id}`);
                }
              }}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.rating}>
                  ⭐ {item.rating.toFixed(1)} ({item.reviews})
                </Text>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.locationLine}>
                  📍 {item.distance}{" "}
                  {item.computedDistance != null &&
                    `• ${item.computedDistance.toFixed(1)} km away`}
                </Text>

                {item.category === "Walker" &&
                  item.routes &&
                  item.routes.length > 0 && (
                    <View style={{ marginTop: 4 }}>
                      <Text style={styles.routesTitle}>Routes:</Text>
                      {item.routes.slice(0, 2).map((r: any, idx: number) => (
                        <Text key={idx} style={styles.routeItem}>
                          • {r.name}
                        </Text>
                      ))}
                      {item.routes.length > 2 && (
                        <Text style={styles.moreRoutes}>
                          + {item.routes.length - 2} more
                        </Text>
                      )}
                    </View>
                  )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  searchWrapper: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  searchInput: { flex: 1, backgroundColor: "#F1F1F1", borderRadius: 10, padding: 12 },
  mapButton: { marginLeft: 10, backgroundColor: "#F1F1F1", padding: 10, borderRadius: 10 },
  categories: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  category: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9F9F9", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, marginBottom: 10 },
  activeCategory: { backgroundColor: "#EAF4FF" },
  categoryText: { marginLeft: 6, fontSize: 13, color: "#666" },
  activeCategoryText: { color: "#007AFF", fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardImage: { width: 80, height: 80, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  rating: { fontSize: 13, color: "#666", marginVertical: 2 },
  price: { fontSize:14, fontWeight:"500", color:"#007AFF"},
  locationLine: { fontSize:12, color:"#777", marginTop:2 },
  routesTitle: { fontSize:12, fontWeight:"600", color:"#34495e" },
  routeItem: { fontSize:11, color:"#555", marginLeft:8 },
  moreRoutes: { fontSize:11, color:"#007AFF", marginLeft:8, fontStyle:"italic" },
});
