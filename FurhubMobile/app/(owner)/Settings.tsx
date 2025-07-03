import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthProvider";
export default function Settings() {
  const { logout, user, setActiveRole } = useAuth();
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="font-bold text-[40px]">Settings</Text>
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
