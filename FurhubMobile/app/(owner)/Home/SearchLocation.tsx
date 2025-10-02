import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { boardings } from "@/services/boarding/boardings";
import { cebuWalkers } from "@/services/walkers/walkers";
import { useRouter } from "expo-router";

interface LocationType {
  id: string;
  name: string;
  lat: number;
  long: number;
  category: string;
}

// Categories with icons
const categories = [
  { id: "1", name: "Boarding", icon: "home" },
  { id: "2", name: "Walker", icon: "walking" },
];

const allLocations: LocationType[] = [
  ...boardings.map((b) => ({
    id: b.id,
    name: b.name,
    lat: b.lat,
    long: b.long,
    category: "Boarding",
  })),
  ...cebuWalkers.map((w) => ({
    id: w.id,
    name: w.name,
    lat: w.lat,
    long: w.long,
    category: "Walker",
  })),
];

export default function SearchLocation(): JSX.Element {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Boarding");
  const [locations, setLocations] = useState<LocationType[]>(
    allLocations.filter((loc) => loc.category === activeCategory)
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; long: number } | null>(null);

  useEffect(() => {
    setLocations(allLocations.filter((loc) => loc.category === activeCategory));
  }, [activeCategory]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: location.coords.latitude, long: location.coords.longitude });
    })();
  }, []);

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([10.3157, 123.8854], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        const locations = ${JSON.stringify(locations)};
        const userLocation = ${JSON.stringify(userLocation)};

        const blueIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const redIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        if (userLocation) {
          L.marker([userLocation.lat, userLocation.long], { icon: redIcon, title: "You are here" }).addTo(map)
            .bindPopup('Your Location').openPopup();
          map.setView([userLocation.lat, userLocation.long], 14);
        }

        locations.forEach(function(loc) {
          const icon = loc.category === 'Boarding' ? blueIcon : greenIcon;
          L.marker([loc.lat, loc.long], { icon }).addTo(map)
            .bindPopup('<b>' + loc.name + '</b><br>' + loc.category + '<br><a href="#" onclick="window.ReactNativeWebView.postMessage(\\'' + loc.id + '\\')">View Profile</a>');
        });
      </script>
    </body>
  </html>
  `;

  return (
    <View style={styles.container}>
      {/* Back Button */}
<TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(owner)/Home/")}>
  <Ionicons name="arrow-back" size={24} color="#007AFF" />
  <Text style={styles.backText}>Back</Text>
</TouchableOpacity>


      {/* Circular Icon Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.tab, cat.name === activeCategory && styles.activeTab]}
              onPress={() => setActiveCategory(cat.name)}
            >
              <View style={[styles.iconCircle, cat.name === activeCategory && styles.activeIconCircle]}>
                <FontAwesome5
                  name={cat.icon as any}
                  size={20}
                  color={cat.name === activeCategory ? "#007AFF" : "#666"}
                />
              </View>
              <Text style={[styles.tabText, cat.name === activeCategory && styles.activeTabText]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map */}
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1, width: Dimensions.get("window").width }}
        onMessage={(event) => {
          const id = event.nativeEvent.data;
          router.push(`/(owner)/Home/Pet Boarding/${id}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  backText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "500",
  },
  tabsContainer: {
    height: 100,
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  tabsScroll: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  tab: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 20,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  activeIconCircle: {
    backgroundColor: "#EAF4FF",
    borderWidth: 1.5,
    borderColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
