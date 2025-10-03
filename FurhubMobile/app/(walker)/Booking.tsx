import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import {
  mockBookings,
  updateBookingStatus,
} from "@/services/boarding/mockBookings";

const tabs = ["Requests", "Approved", "Completed"];

export default function BookingScreen() {
  const walkerId = "walker-1"; // 🔹 Replace with real logged-in walker ID
  const [activeTab, setActiveTab] = useState("Requests");
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = () => {
      const walkerBookings = mockBookings.filter((b) => b.walkerId === walkerId);
      setBookings(walkerBookings);
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "Requests") return b.status === "Pending";
    if (activeTab === "Approved") return b.status === "Approved";
    if (activeTab === "Completed") return b.status === "Completed";
    return true;
  });

  const handleUpdateStatus = (id: string, status: "Approved" | "Cancelled") => {
    updateBookingStatus(id, status);
    setBookings([...mockBookings.filter((b) => b.walkerId === walkerId)]);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-3">My Bookings</Text>

      {/* Tabs */}
      <View className="flex-row justify-between mb-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 mx-1 py-2 rounded-xl ${
              activeTab === tab ? "bg-green-500" : "bg-gray-200"
            }`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === tab ? "text-white" : "text-gray-600"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Booking List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-3 mb-3 rounded-2xl shadow">
            <Text className="font-semibold">Owner: {item.ownerId}</Text>
            <Text>Check-In: {new Date(item.checkIn).toLocaleString()}</Text>
            <Text>Check-Out: {new Date(item.checkOut).toLocaleString()}</Text>
            <Text>Status: {item.status}</Text>

            {activeTab === "Requests" && (
              <View className="flex-row mt-2">
                <TouchableOpacity
                  className="flex-1 bg-green-500 py-2 rounded-xl mx-1"
                  onPress={() => handleUpdateStatus(item.id, "Approved")}
                >
                  <Text className="text-center text-white font-semibold">
                    Approve
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-red-500 py-2 rounded-xl mx-1"
                  onPress={() => handleUpdateStatus(item.id, "Cancelled")}
                >
                  <Text className="text-center text-white font-semibold">
                    Decline
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">
            No {activeTab.toLowerCase()} bookings
          </Text>
        }
      />
    </View>
  );
}
