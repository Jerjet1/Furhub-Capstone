import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/FontAwesome";
import Icon from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "@/context/useAuth";
import { router } from "expo-router";
import React from "react";

export default function SettingsScreen() {
  const { logout, user, setActiveRole } = useAuth();

  const hasOwnerRole = user?.roles.includes("owner");
  const switcherRoles = () => {
    if (hasOwnerRole) {
      setActiveRole("owner");
    } else {
      // router.replace("/(walker)/OwnerScreen")
      console.log("owner? hello");
    }
  };
  return (
    <View className="flex-1 p-3 gap-3 mt-5">
      <TouchableOpacity
        className="py-5 border-b bg-gray-200"
        onPress={() => router.replace("/(walker)/Settings/AccountProfile")}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">Account Profile</Text>
          <Ionicons name="chevron-right" size={25} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="py-5 border-b bg-gray-200"
        onPress={() => {
          router.replace("/(walker)/Settings/WalkerProfile");
          console.log("hello");
        }}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">Walker Profile</Text>
          <Ionicons name="chevron-right" size={25} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="py-5 border-b bg-gray-200"
        onPress={switcherRoles}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">
            {hasOwnerRole ? "Switch to Owner" : "Owner"}
          </Text>
          <Ionicons name="chevron-right" size={25} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity className="py-5 border-b bg-gray-200" onPress={logout}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">Logout</Text>
          <Icon name="door-open" size={25} color="gray" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
