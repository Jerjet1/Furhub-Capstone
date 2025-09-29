import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";          // ✅ Add this import
import { useAuth } from "@/context/useAuth"; // ✅ Correct hook

export default function Home() {
  const { logout, user, setActiveRole } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text>Walker Home</Text>

      {/* Logout Button */}
      <TouchableOpacity className="bg-red-500 p-5 mb-5" onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      {/* Switch Role Buttons */}
      {user?.roles.map((role) => (
        <TouchableOpacity
          key={role}
          className="bg-red-500 p-5 mb-5"
          onPress={() => setActiveRole(role)}
        >
          <Text>Switch user to {role}</Text>
        </TouchableOpacity>
      ))}

      {/* Chat Link */}
      <View className="flex-row space-x-4 mt-4">
        <Link href="/messages" asChild>
          <TouchableOpacity className="px-4 py-3 bg-[#a3b84e] rounded-xl">
            <Text className="font-semibold">Chat</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
