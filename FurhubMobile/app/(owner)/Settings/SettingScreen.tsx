import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "@/context/useAuth";

export default function SettingScreen() {
  const { logout, user, setActiveRole } = useAuth();

  const hasWalkerRole = user?.roles.includes("walker");
  const switcherRole = () => {
    if (hasWalkerRole) {
      setActiveRole("walker");
    } else {
      console.log("wanna become a walker role?");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-orange-100 to-orange-50 p-5">
      {/* Cute Header */}
      <View className="items-center mb-8">
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png" }}
          className="w-20 h-20 mb-3"
        />
      </View>

      {/* Account Profile */}
      <TouchableOpacity
        className="bg-white rounded-3xl p-5 mb-5 shadow-lg flex-row items-center justify-between border border-orange-200"
        onPress={() => router.push("/(owner)/Settings/AccountProfile")}
      >
        <View className="flex-row items-center gap-4">
          <Ionicons name="person-circle" size={28} color="#f97316" />
          <Text className="text-lg font-bold text-gray-800">
            Account Profile
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#f97316" />
      </TouchableOpacity>

      {/* Pet Profile */}
      <TouchableOpacity
        className="bg-white rounded-3xl p-5 mb-5 shadow-lg flex-row items-center justify-between border border-green-200"
        onPress={() => router.push("/(owner)/Settings/PetProfile")}
      >
        <View className="flex-row items-center gap-4">
          <FontAwesome5 name="dog" size={28} color="#16a34a" />
          <Text className="text-lg font-bold text-gray-800">Pet Profile</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#16a34a" />
      </TouchableOpacity>

      {/* Walker Role */}
      <TouchableOpacity
        className="bg-white rounded-3xl p-5 mb-5 shadow-lg flex-row items-center justify-between border border-pink-200"
        onPress={switcherRole}
      >
        <View className="flex-row items-center gap-4">
          <FontAwesome5 name="paw" size={28} color="#e11d48" />
          <Text className="text-lg font-bold text-gray-800">
            {hasWalkerRole ? "Switch to Walker" : "Become a Walker"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#e11d48" />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        className="bg-white rounded-3xl p-5 shadow-lg flex-row items-center justify-between border border-gray-300"
        onPress={logout}
      >
        <View className="flex-row items-center gap-4">
          <Ionicons name="log-out-outline" size={28} color="#6b7280" />
          <Text className="text-lg font-bold text-gray-800">Logout</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#6b7280" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
