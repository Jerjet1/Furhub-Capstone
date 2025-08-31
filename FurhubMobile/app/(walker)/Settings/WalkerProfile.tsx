import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";

export default function WalkerProfile() {
  return (
    <View className="flex-1 p-3 gap-3 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => router.replace("/(walker)/Settings/SettingScreen")}>
          <Ionicons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-[25px] font-semibold text-center flex-1">
          Walker Profile
        </Text>
        <View className="w-10 h-10" />
      </View>
    </View>
  );
}
