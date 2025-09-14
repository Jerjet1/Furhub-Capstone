import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { WebView } from "react-native-webview";
import Geolocation from "react-native-geolocation-service";
import { Ionicons } from "@expo/vector-icons";
import { locationAPI } from "@/services/api";
import { userDetailsAPI } from "@/services/userAPI";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// Route params type
type LocationScreenRouteParams = {
  address?: string;
};

type LocationScreenRouteProp = RouteProp<{ params: LocationScreenRouteParams }, "params">;

export default function LocationWebViewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<LocationScreenRouteProp>();
  
  const [step, setStep] = useState<"form" | "map">("form");
  const [coords, setCoords] = useState({ lat: 10.3157, lng: 123.8854 }); // default Cebu
  const [city, setCity] = useState<string>("");
  const [barangay, setBarangay] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Get existing address from route params
  const existingAddress = route.params?.address || "";

  useEffect(() => {
    if (existingAddress) {
      const parts = existingAddress.split(", ");
      setStreet(parts[0] || "");
      setBarangay(parts[1] || "");
      setCity(parts[2] || "");
    }
  }, [existingAddress]);

  // Request location permission & get GPS if needed
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Cannot access GPS location");
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestLocationPermission();
  }, []);

  // Generate HTML content for WebView
  const htmlContent = `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <style>html, body { height: 100%; margin:0; padding:0; } #map{height:100vh;width:100%;border-radius:12px;}</style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          let lat = ${coords.lat};
          let lng = ${coords.lng};
          const map = L.map('map').setView([lat, lng], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          const marker = L.marker([lat, lng], { draggable:true }).addTo(map);
          marker.on('dragend', () => {
            const p = marker.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: p.lat, lng: p.lng }));
          });
          map.on('click', (e) => {
            lat = e.latlng.lat;
            lng = e.latlng.lng;
            marker.setLatLng([lat,lng]);
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat, lng }));
          });
        </script>
      </body>
    </html>
  `;

  const handleSave = async () => {
    if (!city || !barangay || !street) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const fullAddress = `${street}, ${barangay}, ${city}, Cebu`;

    try {
      // Save location to backend
      const payload = { province: "Cebu", city, barangay, street, latitude: coords.lat, longitude: coords.lng };
      await locationAPI.createLocation(payload);

      // Update user details
      await userDetailsAPI.updateUser({ address: fullAddress });

      Alert.alert("Success", "Location saved!");
      navigation.navigate("AccountProfile", { updatedAddress: fullAddress });
    } catch (err: any) {
      console.log("Error saving location:", err);
      Alert.alert("Error", "Failed to save location. Make sure your server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === "form" ? (
        <View style={styles.form}>
          {/** City Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="paw" size={20} color="#FF914D" style={styles.icon} />
            <TextInput placeholder="Enter City" value={city} onChangeText={setCity} style={styles.input} />
          </View>

          {/** Barangay Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="paw" size={20} color="#FF914D" style={styles.icon} />
            <TextInput placeholder="Enter Barangay" value={barangay} onChangeText={setBarangay} style={styles.input} />
          </View>

          {/** Street Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="paw" size={20} color="#FF914D" style={styles.icon} />
            <TextInput placeholder="Enter Street" value={street} onChangeText={setStreet} style={styles.input} />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, (!city || !barangay || !street) && styles.disabledButton]}
            onPress={() => setStep("map")}
            disabled={!city || !barangay || !street}
          >
            <Text style={styles.saveText}>➡️ Next</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            javaScriptEnabled
            domStorageEnabled
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              setCoords({ lat: data.lat, lng: data.lng });
            }}
            style={{ flex: 1 }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep("form")}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveButton, isLoading && styles.disabledButton]} onPress={handleSave} disabled={isLoading}>
              <Text style={styles.saveText}>{isLoading ? "Saving..." : "🐶 Save Location"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  form: { padding: 20, flex: 1, justifyContent: "center" },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFAF0", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 18, borderWidth: 2, borderColor: "#FFD699" },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, fontWeight: "600", color: "#333" },
  saveButton: { backgroundColor: "#FF914D", paddingVertical: 16, borderRadius: 30, alignItems: "center" },
  disabledButton: { backgroundColor: "#FFCC99", opacity: 0.7 },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", padding: 20, backgroundColor: "#FFF8F0" },
  backButton: { backgroundColor: "#FFE6CC", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, alignItems: "center", flex: 1, marginRight: 10 },
  backText: { color: "#FF914D", fontSize: 18, fontWeight: "bold" },
});
