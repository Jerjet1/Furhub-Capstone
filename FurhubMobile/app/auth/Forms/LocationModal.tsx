import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    latitude: number;
    longitude: number;
    province?: string;
    city?: string;
    barangay?: string;
    street?: string;
  }) => void;
}

export default function LocationModal({ visible, onClose, onSave }: LocationModalProps) {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 14.5995,
    longitude: 120.9842,
  });
  const [address, setAddress] = useState<{
    province?: string;
    city?: string;
    barangay?: string;
    street?: string;
  }>({});
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    (async () => {
      if (!visible) return;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to pick your location.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, [visible]);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"/>
        <style>
          html, body, #map { height: 100%; margin:0; padding:0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
        <script>
          var initialLat = ${coords.latitude};
          var initialLng = ${coords.longitude};

          var map = L.map('map').setView([initialLat, initialLng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          var marker = L.marker([initialLat, initialLng], {draggable:true}).addTo(map);

          function sendCoords(lat, lng, popupText){
            window.ReactNativeWebView.postMessage(JSON.stringify({
              latitude: lat, longitude: lng, popup: popupText
            }));
          }

          async function updateAddress(lat, lng){
            try {
              const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?lat=\${lat}&lon=\${lng}&format=json\`);
              const data = await res.json();
              const addr = data.address || {};
              const text = \`Province: \${addr.state || ''}, City: \${addr.city || addr.town || ''}, Barangay: \${addr.suburb || ''}, Street: \${addr.road || ''}\`;
              marker.bindPopup(text).openPopup();
              sendCoords(lat, lng, text);
            } catch (err){
              console.log('Geocoding error', err);
              sendCoords(lat, lng, '');
            }
          }

          updateAddress(initialLat, initialLng);

          marker.on('dragend', function(e){
            var pos = marker.getLatLng();
            updateAddress(pos.lat, pos.lng);
          });

          map.on('click', function(e){
            marker.setLatLng(e.latlng);
            updateAddress(e.latlng.lat, e.latlng.lng);
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    setCoords({ latitude: data.latitude, longitude: data.longitude });
    if (data.popup) {
      const parts = data.popup.split(",").map((p) => p.split(":")[1]?.trim() || "");
      setAddress({
        province: parts[0] || "",
        city: parts[1] || "",
        barangay: parts[2] || "",
        street: parts[3] || "",
      });
    }
  };

  const handleSave = () => {
    onSave({ latitude: coords.latitude, longitude: coords.longitude, ...address });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.container, { height: screenHeight * 0.85 }]}>
          <Text style={styles.header}>Pick Location</Text>

          {loading && <ActivityIndicator size="large" color="green" style={{ marginBottom: 10 }} />}

          <ScrollView
            style={styles.addressContainer}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              style={styles.input}
              placeholder="Province"
              value={address.province}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, province: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={address.city}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, city: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Barangay"
              value={address.barangay}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, barangay: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Street"
              value={address.street}
              onChangeText={(text) => setAddress((prev) => ({ ...prev, street: text }))}
            />
          </ScrollView>

          <View style={{ flex: 1, borderRadius: 12, overflow: "hidden" }}>
            <WebView
              originWhitelist={["*"]}
              source={{ html }}
              style={{ flex: 1, width: "100%" }}
              onMessage={handleMessage}
              onLoadEnd={() => setLoading(false)}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  addressContainer: {
    maxHeight: 150,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "gray",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  saveBtn: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
