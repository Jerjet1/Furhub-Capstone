// /(owner)/Home/WalkerBookingRequest/[id].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { cebuWalkers } from "@/services/walkers/walkers";
import { FontAwesome5 } from "@expo/vector-icons";

export default function WalkerBookingRequest() {
  const { id, route } = useLocalSearchParams<{ id: string; route?: string }>();
  const walker = cebuWalkers.find((w) => w.id === id);

  const [selectedRoute, setSelectedRoute] = useState<string | undefined>(route);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startMode, setStartMode] = useState<"date" | "time">("date");
  const [endMode, setEndMode] = useState<"date" | "time">("date");

  if (!walker) {
    return (
      <View style={styles.center}>
        <Text>Walker not found</Text>
      </View>
    );
  }

  const handleBooking = () => {
    if (!selectedRoute) {
      Alert.alert("No Route Selected", "Please select a route before booking.");
      return;
    }

    if (endTime <= startTime) {
      Alert.alert("Invalid End Time", "End time must be after start time.");
      return;
    }

    // Create booking
// WalkerBookingRequest.tsx
    addBooking(
      {
        ...walker,
        route: selectedRoute,
        checkIn: startTime,
        checkOut: endTime,
        notes,
      },
      "owner-1",   // TODO: replace with logged-in owner ID
      walker.id    // from the selected walker
    );

    Alert.alert("Request Sent ✅", "Your booking request has been sent.", [
      { text: "OK", onPress: () => router.push("/(owner)/Home") },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Walker Info */}
      <View style={styles.card}>
        <Text style={styles.title}>{walker.name}</Text>
        <Text style={styles.subtitle}>₱{walker.pricePerHour}/hour</Text>
      </View>

      {/* Selected Route */}
      <View style={styles.card}>
        <Text style={styles.label}>Selected Route</Text>
        <Text style={{ fontSize: 16, color: "#2c3e50", marginTop: 4 }}>
          {selectedRoute || "No route selected"}
        </Text>
      </View>

      {/* Start Time */}
      <View style={styles.card}>
        <Text style={styles.label}>Start Time</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setStartMode("date");
              setShowStart(true);
            }}
          >
            <FontAwesome5 name="calendar" size={16} color="#3498db" />
            <Text style={styles.dateText}>{startTime.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setStartMode("time");
              setShowStart(true);
            }}
          >
            <FontAwesome5 name="clock" size={16} color="#3498db" />
            <Text style={styles.dateText}>
              {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>
        </View>
        {showStart && (
          <DateTimePicker
            value={startTime}
            mode={startMode}
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowStart(false);
              if (date) setStartTime(date);
            }}
          />
        )}
      </View>

      {/* End Time */}
      <View style={styles.card}>
        <Text style={styles.label}>End Time</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setEndMode("date");
              setShowEnd(true);
            }}
          >
            <FontAwesome5 name="calendar-alt" size={16} color="#e67e22" />
            <Text style={styles.dateText}>{endTime.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setEndMode("time");
              setShowEnd(true);
            }}
          >
            <FontAwesome5 name="clock" size={16} color="#e67e22" />
            <Text style={styles.dateText}>
              {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>
        </View>
        {showEnd && (
          <DateTimePicker
            value={endTime}
            mode={endMode}
            display="default"
            minimumDate={startTime}
            onChange={(event, date) => {
              setShowEnd(false);
              if (date) setEndTime(date);
            }}
          />
        )}
      </View>

      {/* Notes */}
      <View style={styles.card}>
        <Text style={styles.label}>Special Notes</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Add notes about your pet (diet, behavior, etc.)"
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Confirm Booking */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
        <FontAwesome5 name="check-circle" size={18} color="#fff" />
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 22, fontWeight: "700", color: "#2c3e50" },
  subtitle: { fontSize: 16, fontWeight: "600", marginTop: 6, color: "#27ae60" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#34495e" },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ecf0f1",
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  dateText: { fontSize: 15, marginLeft: 10, color: "#2c3e50" },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: "#e67e22",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },
});
