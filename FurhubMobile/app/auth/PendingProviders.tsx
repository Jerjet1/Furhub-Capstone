import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
// import { useAuth } from "@/context/AuthProvider";
import { useAuth } from "@/context/useAuth";

import React from "react";

export default function PendingProviders() {
  const { logout } = useAuth();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Admin will verify your application....</Text>
      <TouchableOpacity onPress={logout}>
        <Text className="text-blue-600 text-lg">Go back to login</Text>
      </TouchableOpacity>
    </View>
  );
}
