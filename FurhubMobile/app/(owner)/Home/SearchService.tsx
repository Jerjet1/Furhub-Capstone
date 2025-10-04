import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function SearchService() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const services = [
    {
      id: "1",
      name: "Alex the Dog Walker",
      type: "walker",
      distance: "1.2 km",
      image: "https://place-puppy.com/200x200",
    },
    {
      id: "2",
      name: "Mia’s Pet Boarding",
      type: "boarding",
      distance: "2.5 km",
      image: "https://place-puppy.com/201x201",
    },
    {
      id: "3",
      name: "Sam the Cat Lover",
      type: "walker",
      distance: "3.0 km",
      image: "https://place-puppy.com/202x202",
    },
  ];

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = (item: {
    id: string;
    type: string;
    name: string;
    image: string;
  }) => {
    if (item.type === "boarding") {
      router.push(
        `/(owner)/Home/Pet Boarding/RequestBooking?serviceId=${item.id}&serviceName=${item.name}`
      );
    } else {
      router.push({
        pathname: "/(owner)/Home/Pet walker/WalkerProfile",
        params: { id: item.id, name: item.name, image: item.image },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Search Pet Services</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by service or location..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.distance}>📍 {item.distance} away</Text>
              <Text style={styles.type}>
                {item.type === "walker" ? "Dog / Cat Walker" : "Pet Boarding"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#333" },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  cardContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#222" },
  distance: { fontSize: 14, color: "#666", marginTop: 4 },
  type: { fontSize: 14, color: "#007AFF", marginTop: 2, fontWeight: "500" },
});
