import { View, Text, TouchableOpacity } from "react-native";
// import { useAuth } from "@/context/AuthProvider";
import { useAuth } from "@/context/useAuth";

import React from "react";

export default function Unauthorize() {
  const { logout } = useAuth();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Unauthorized access</Text>
      <TouchableOpacity onPress={logout}>
        <Text className="text-blue-600 text-lg">Go back to login</Text>
      </TouchableOpacity>
    </View>
  );
}
