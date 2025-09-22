import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { boardings } from "@/services/boarding/boardings";
import { cebuWalkers } from "@/services/walkers/walkers";

// Categories
const categories = [
  { id: "1", name: "Boarding", icon: "home" },
  { id: "2", name: "Walker", icon: "walking" },
];

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
  })),
  ...cebuWalkers.map((w) => ({
    id: w.id,
    name: w.name,
    image: w.image,
    reviews: w.reviews,
    rating: w.rating,
    price: `₱${w.pricePerHour}/hour • ${w.services.join(", ")}`,
    distance: `${w.barangay}, ${w.city}`,
    category: "Walker",
  })),
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Boarding");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter services by category and search query
  const filteredServices = services.filter(
    (service) =>
      service.category === activeCategory &&
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
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

      {/* Categories */}
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

      {/* Section Title */}
      <Text style={styles.sectionTitle}>{activeCategory} Services Nearby</Text>

      {/* Service Cards */}
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
                  // ✅ Fixed path: folder should be [walkerId].tsx
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
                  ⭐ {item.rating.toFixed(1)} ({item.reviews} reviews)
                </Text>
                <Text style={styles.price}>Starting from {item.price}</Text>
                <Text style={styles.distance}>{item.distance}</Text>
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
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    padding: 12,
  },
  mapButton: {
    marginLeft: 10,
    backgroundColor: "#F1F1F1",
    padding: 10,
    borderRadius: 10,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  activeCategory: {
    backgroundColor: "#EAF4FF",
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#666",
  },
  activeCategoryText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  rating: { fontSize: 13, color: "#666", marginVertical: 2 },
  price: { fontSize: 14, fontWeight: "500", color: "#007AFF" },
  distance: { fontSize: 12, color: "#999" },
});
