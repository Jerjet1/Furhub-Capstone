import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/FontAwesome";
import Icon from "@expo/vector-icons/FontAwesome5";
import React from "react";
// import { useAuth } from "@/context/AuthProvider";
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
    <View className="flex-1 p-3 gap-3 mt-5">
      <TouchableOpacity
        className="py-5  border-b bg-gray-300"
        onPress={() => router.replace("/(owner)/Settings/AccountProfile")}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">Account Profile</Text>
          <Ionicons name="chevron-right" size={25} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="py-5 px-2 border-b bg-gray-300"
        onPress={() => router.replace("/(owner)/Settings/PetProfile")}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">Pet Profile</Text>
          <Ionicons name="chevron-right" size={25} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="py-5 border-b bg-gray-300"
        onPress={switcherRole}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">
            {hasWalkerRole ? "Switch to Walker" : "Become a Walker"}
          </Text>
          <Ionicons name="chevron-right" size={25} color="gray" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity className="py-5 border-b bg-gray-300" onPress={logout}>
        <View className="flex flex-row justify-between px-4">
          <Text className="text-xl font-semibold">Logout</Text>
          <Icon name="door-open" size={25} color="gray" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
