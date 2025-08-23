import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";

export default function ChangePassword() {
  return (
    <View>
      {/* Back button */}
      <TouchableOpacity
        className="w-10 h-10 items-center justify-center"
        onPress={() => router.replace("/(owner)/Settings/AccountProfile")}>
        <Ionicons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text>ChangePassword</Text>
    </View>
  );
}
