import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { mockBookings } from "@/services/boarding/mockBookings";
import { router } from "expo-router";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const prevApproved = useRef<Set<string>>(new Set());
  const prevPaid = useRef<Set<string>>(new Set());
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load sound once
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/notifications.mp3")
        );
        soundRef.current = sound;
      } catch (e) {
        console.log("Error loading sound:", e);
      }
    };
    loadSound();

    // Unload on cleanup
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Set audio mode for iOS & Android
useEffect(() => {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS, // ✅ use valid constant
    playThroughEarpieceAndroid: false,
  });
}, []);

  // Play sound
  const playNotificationSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  // Check for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      let newNotifications: any[] = [];

      // Approved bookings
      const approvedBookings = mockBookings.filter(
        (b) => b.status === "Approved" && !prevApproved.current.has(b.id)
      );
      approvedBookings.forEach((b) => prevApproved.current.add(b.id));
      newNotifications.push(
        ...approvedBookings.map((b) => ({ ...b, type: "approved" }))
      );

      // Paid bookings
      const paidBookings = mockBookings.filter(
        (b) => b.paymentStatus === "Paid" && !prevPaid.current.has(b.id)
      );
      paidBookings.forEach((b) => prevPaid.current.add(b.id));
      newNotifications.push(
        ...paidBookings.map((b) => ({ ...b, type: "paid" }))
      );

      if (newNotifications.length > 0) {
        newNotifications.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setNotifications((prev) => [...newNotifications, ...prev]);
        playNotificationSound();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePress = (booking: any) => {
    const alertTitle = booking.type === "approved" ? "Booking Approved" : "Payment Confirmed";
    const alertMessage =
      booking.type === "approved"
        ? `Your booking at ${booking.facility.name} has been approved!`
        : `Your payment for ${booking.facility.name} has been received!`;

    Alert.alert(alertTitle, alertMessage, [
      {
        text: "View",
        onPress: () =>
          router.push({
            pathname: "/(owner)/Bookinglist",
            params: { bookingId: booking.id },
          }),
      },
      { text: "Close" },
    ]);
  };

  const renderItem = ({ item }: any) => {
    const dateStr = `${new Date(item.checkIn).toDateString()} - ${new Date(
      item.checkOut
    ).toDateString()}`;
    const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity style={styles.notificationCard} onPress={() => handlePress(item)}>
        <Text style={styles.title}>{item.facility.name}</Text>
        <Text style={styles.message}>
          {item.type === "approved" ? "✅ Your booking has been approved!" : "💰 Payment confirmed!"}
        </Text>
        <Text style={styles.dateTime}>
          {dateStr} • {timeStr}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  notificationCard: {
    backgroundColor: "#EAF4FF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  message: { fontSize: 14, color: "#2c3e50", marginBottom: 4 },
  dateTime: { fontSize: 12, color: "#666" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#999" },
});
