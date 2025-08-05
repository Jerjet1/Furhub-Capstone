// app/(walker)/Home.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthProvider";
import { router } from "expo-router"; // ✅ Don't forget this
import React from "react";

export default function Home() {
  const { logout, user, setActiveRole } = useAuth();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="font-bold text-[40px]">Walker Home</Text>

      <TouchableOpacity
        className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
        onPress={() => router.push("/chat")}
      >
        <Text className="text-white text-lg">Go to Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/ratings')}
        className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
      > 
        <Text className="text-white text-lg">Reviews and Ratings</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-red-500 p-5 mt-8" onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      {user?.roles.map((role) => (
        <TouchableOpacity
          key={role}
          className="bg-red-500 p-5 mt-4"
          onPress={() => setActiveRole(role)}
        >
          <Text>Switch user to {role}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
