import { View, Text, TouchableOpacity } from "react-native";
// import { useAuth } from "@/context/AuthProvider";
import { useAuth } from "@/context/useAuth";

import React from "react";

export default function Home() {
  const { logout, user, setActiveRole } = useAuth();
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Walker Home</Text>
      <TouchableOpacity className="bg-red-500 p-5 mb-5" onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      {user?.roles.map((role) => (
        <TouchableOpacity
          key={role}
          className="bg-red-500 p-5"
          onPress={() => setActiveRole(role)}>
          <Text>switch user to {role}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
