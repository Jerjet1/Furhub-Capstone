import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Animated,
} from "react-native";
import { mockBookings, updateBookingStatus } from "@/services/boarding/mockBookings";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

const categories = [
  { id: "1", name: "Pending" },
  { id: "2", name: "Approved" },
  { id: "3", name: "Completed" },
  { id: "4", name: "Cancelled" },
];

export default function BookingList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const indicatorX = useRef(new Animated.Value(0)).current;
  const tabWidths = useRef<number[]>([]);

  // Reload bookings whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setBookings([...mockBookings]);
    }, [])
  );

  // Cancel booking
  const handleCancel = (bookingId: string) => {
    Alert.alert("Cancel Booking", "Are you sure?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => {
          updateBookingStatus(bookingId, "Cancelled");
          setBookings([...mockBookings]);
        },
      },
    ]);
  };

  // Go to payment
  const handlePay = (bookingId: string) => {
    router.push({
      pathname: "/(owner)/Home/payment/SelectPayment",
      params: { bookingId },
    });
  };

  // Filter bookings based on tab
  const filteredBookings = bookings.filter((b) => {
    switch (selectedCategory) {
      case "Pending":
        return b.status === "Pending";
      case "Approved":
        return b.status === "Approved";
      case "Completed":
        return b.status === "Paid"; // ✅ change later if you add "Completed"
      case "Cancelled":
        return b.status === "Cancelled";
      default:
        return true;
    }
  });

  // Render each booking card
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.facility.image || "https://via.placeholder.com/80" }}
        style={styles.cardImage}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle}>{item.facility.name}</Text>
        <Text style={styles.status}>
          Status:{" "}
          <Text
            style={
              item.status === "Approved"
                ? styles.approved
                : item.status === "Pending"
                ? styles.pending
                : item.status === "Paid"
                ? styles.paid
                : styles.cancelled
            }
          >
            {item.status}
          </Text>
        </Text>
        <Text style={styles.date}>
          {new Date(item.checkIn).toDateString()} -{" "}
          {new Date(item.checkOut).toDateString()}
        </Text>

        <View style={styles.actions}>
          {item.status === "Approved" && (
            <>
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => handlePay(item.id)}
              >
                <Text style={styles.actionText}>Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(item.id)}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  // Move indicator under selected tab
  const moveIndicator = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) offset += tabWidths.current[i] + 10;
    Animated.spring(indicatorX, {
      toValue: offset,
      useNativeDriver: true,
    }).start();
  };

  const onTabPress = (index: number, name: string) => {
    setSelectedCategory(name);
    moveIndicator(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Tabs always on top */}
      <View style={{ zIndex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.category,
                cat.name === selectedCategory && styles.activeCategory,
              ]}
              onPress={() => onTabPress(index, cat.name)}
              onLayout={(e) =>
                (tabWidths.current[index] = e.nativeEvent.layout.width)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  cat.name === selectedCategory && styles.activeCategoryText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.underline,
              {
                width:
                  tabWidths.current[
                    categories.findIndex((c) => c.name === selectedCategory)
                  ] || 0,
                transform: [{ translateX: indicatorX }],
              },
            ]}
          />
        </ScrollView>
      </View>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <Text style={styles.empty}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    backgroundColor: "#F9F9F9",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategory: { backgroundColor: "#EAF4FF" },
  categoryText: { fontSize: 13, color: "#666" },
  activeCategoryText: { color: "#007AFF", fontWeight: "600" },
  underline: {
    height: 3,
    backgroundColor: "#007AFF",
    position: "absolute",
    bottom: 0,
    left: 15,
    borderRadius: 2,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: { width: 80, height: 80, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  status: { fontSize: 13, marginVertical: 2 },
  date: { fontSize: 12, color: "#999" },
  approved: { color: "green", fontWeight: "700" },
  pending: { color: "orange", fontWeight: "700" },
  paid: { color: "blue", fontWeight: "700" },
  cancelled: { color: "red", fontWeight: "700" },
  actions: { flexDirection: "row", marginTop: 8 },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  payButton: { backgroundColor: "#27ae60", padding: 8, borderRadius: 12 },
  actionText: { color: "#fff", fontWeight: "700" },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#7f8c8d",
  },
});
