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
import { boardings } from "@/services/boarding/boardings";
import { FontAwesome5 } from "@expo/vector-icons";
import { mockBookings,addBooking } from "@/services/boarding/mockBookings";

export default function RequestBooking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const boarding = boardings.find((b) => b.id === id);

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkInMode, setCheckInMode] = useState<"date" | "time">("date");
  const [checkOutMode, setCheckOutMode] = useState<"date" | "time">("date");

  if (!boarding) {
    return (
      <View style={styles.center}>
        <Text>Boarding facility not found</Text>
      </View>
    );
  }

const handleBooking = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkInDateOnly = new Date(checkIn);
  checkInDateOnly.setHours(0, 0, 0, 0);

  if (checkInDateOnly < today) {
    Alert.alert("Invalid Check-In", "Check-in cannot be in the past.");
    return;
  }

  if (checkOut <= checkIn) {
    Alert.alert("Invalid Check-Out", "Check-out must be after check-in.");
    return;
  }

  // Check for overlapping bookings
  const overlap = mockBookings.some(
    (b) =>
      b.facility.id === boarding.id &&
      b.status !== "Cancelled" &&
      ((checkIn >= b.checkIn && checkIn < b.checkOut) ||
        (checkOut > b.checkIn && checkOut <= b.checkOut) ||
        (checkIn <= b.checkIn && checkOut >= b.checkOut))
  );

  if (overlap) {
    Alert.alert(
      "Booking Conflict",
      "This facility is already booked for the selected dates and times."
    );
    return;
  }

  // Use addBooking from mock data
  const newBooking = addBooking({
    ...boarding,
    checkIn,
    checkOut,
    notes,
  });

  Alert.alert("Request Sent ✅", "Your booking request has been sent.", [
    { text: "OK", onPress: () => router.push("/(owner)/Home") },
  ]);
};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Facility Info */}
      <View style={styles.card}>
        <Text style={styles.title}>{boarding.name}</Text>
        <Text style={styles.subtitle}>₱{boarding.pricePerNight} / night</Text>
      </View>

      {/* Check-in */}
      <View style={styles.card}>
        <Text style={styles.label}>Check-In</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCheckInMode("date");
              setShowCheckIn(true);
            }}
          >
            <FontAwesome5 name="calendar" size={16} color="#3498db" />
            <Text style={styles.dateText}>{checkIn.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCheckInMode("time");
              setShowCheckIn(true);
            }}
          >
            <FontAwesome5 name="clock" size={16} color="#3498db" />
            <Text style={styles.dateText}>{checkIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </TouchableOpacity>
        </View>
        {showCheckIn && (
          <DateTimePicker
            value={checkIn}
            mode={checkInMode}
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowCheckIn(false);
              if (date) setCheckIn(date);
            }}
          />
        )}
      </View>

      {/* Check-out */}
      <View style={styles.card}>
        <Text style={styles.label}>Check-Out</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCheckOutMode("date");
              setShowCheckOut(true);
            }}
          >
            <FontAwesome5 name="calendar-alt" size={16} color="#e67e22" />
            <Text style={styles.dateText}>{checkOut.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCheckOutMode("time");
              setShowCheckOut(true);
            }}
          >
            <FontAwesome5 name="clock" size={16} color="#e67e22" />
            <Text style={styles.dateText}>{checkOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </TouchableOpacity>
        </View>
        {showCheckOut && (
          <DateTimePicker
            value={checkOut}
            mode={checkOutMode}
            display="default"
            minimumDate={checkIn}
            onChange={(event, date) => {
              setShowCheckOut(false);
              if (date) setCheckOut(date);
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

      {/* Confirm Button */}
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
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  title: { fontSize: 22, fontWeight: "700", color: "#2c3e50" },
  subtitle: { fontSize: 16, fontWeight: "600", marginTop: 6, color: "#27ae60" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#34495e" },
  dateButton: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#ecf0f1", borderRadius: 10 },
  dateText: { fontSize: 15, marginLeft: 10, color: "#2c3e50" },
  textInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: "#fff", minHeight: 80, textAlignVertical: "top" },
  confirmButton: { flexDirection: "row", backgroundColor: "#e67e22", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 12, marginBottom: 20 },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },
});
