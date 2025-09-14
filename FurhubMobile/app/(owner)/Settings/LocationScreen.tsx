import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Alert,
  Platform,
  PermissionsAndroid,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import Geolocation from "react-native-geolocation-service";
import { Ionicons } from "@expo/vector-icons";
import { locationAPI } from "@/services/api";
import { userDetailsAPI } from "@/services/userAPI";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// Define the type for route parameters
type LocationScreenRouteParams = {
  address?: string;
};

// Define the route prop type
type LocationScreenRouteProp = RouteProp<{ params: LocationScreenRouteParams }, 'params'>;

export default function LocationWebViewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<LocationScreenRouteProp>();
  const [step, setStep] = useState<"form" | "map">("form");
  const [coords, setCoords] = useState({ lat: 10.3157, lng: 123.8854 });
  const [city, setCity] = useState<string>("");
  const [barangay, setBarangay] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Get existing address from params if available
  const existingAddress = route.params?.address || "";

  // Pre-fill form if editing existing address
  useEffect(() => {
    if (existingAddress) {
      // Parse the existing address to pre-fill the form
      const addressParts = existingAddress.split(", ");
      if (addressParts.length >= 3) {
        setStreet(addressParts[0] || "");
        setBarangay(addressParts[1] || "");
        setCity(addressParts[2] || "");
      }
    }
  }, [existingAddress]);

  // Request location permission
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
        (err) => console.log(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    requestLocationPermission();
  }, []);

  const htmlContent = `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <style>
          html, body { height: 100%; margin: 0; padding: 0; }
          #map { height: 100vh; width: 100%; border-radius: 12px; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          let lat = ${coords.lat};
          let lng = ${coords.lng};
          const map = L.map('map').setView([lat, lng], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          const marker = L.marker([lat, lng], {draggable:true}).addTo(map);
          marker.on('dragend', () => {
            const p = marker.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: p.lat, lng: p.lng }));
          });
          map.on('click', function(e) {
            lat = e.latlng.lat;
            lng = e.latlng.lng;
            marker.setLatLng([lat, lng]);
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
      // Save to location API
      const payload = {
        province: "Cebu",
        city,
        barangay,
        street,
        latitude: coords.lat,
        longitude: coords.lng,
      };
      
      await locationAPI.createLocation(payload);
      
      // Update user's address in the main user details
      await userDetailsAPI.updateUser({ address: fullAddress });
      
      Alert.alert("Success", "Location saved!");
      
      // Navigate back with the updated address
      navigation.navigate("AccountProfile", { updatedAddress: fullAddress });
    } catch (err: any) {
      console.log("Error saving location:", err);
      Alert.alert("Error", "Failed to save location");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === "form" ? (
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons name="paw" size={20} color="#FF914D" style={styles.icon} />
            <TextInput 
              placeholder="Enter City" 
              value={city} 
              onChangeText={setCity} 
              style={styles.input} 
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="paw" size={20} color="#FF914D" style={styles.icon} />
            <TextInput 
              placeholder="Enter Barangay" 
              value={barangay} 
              onChangeText={setBarangay} 
              style={styles.input} 
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="paw" size={20} color="#FF914D" style={styles.icon} />
            <TextInput 
              placeholder="Enter Street" 
              value={street} 
              onChangeText={setStreet} 
              style={styles.input} 
            />
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
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setStep("form")}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.disabledButton]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveText}>
                {isLoading ? "Saving..." : "🐶 Save Location"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF8F0", // light warm background
  },
  form: { 
    padding: 20, 
    flex: 1, 
    justifyContent: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF0", // soft cream
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#FFD699", // playful warm color
    shadowColor: "#FF914D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: { 
    marginRight: 10, 
    color: "#FF914D",
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: "#333",
    fontWeight: "600",
  },
  saveButton: { 
    backgroundColor: "#FF914D", 
    paddingVertical: 16, 
    paddingHorizontal: 20,
    borderRadius: 30, 
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#FF914D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#FFCC99",
    opacity: 0.7,
  },
  saveText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF8F0',
  },
  backButton: {
    backgroundColor: "#FFE6CC",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    shadowColor: "#FFA64D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  backText: {
    color: "#FF914D", 
    fontSize: 18, 
    fontWeight: "bold"
  }
});
