import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { mockChats } from "@/services/walkers/mockChats";

export default function ChatScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-3">Chats</Text>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-gray-100 p-3 mb-3 rounded-2xl shadow">
            <Text className="font-semibold">{item.owner}</Text>
            <Text numberOfLines={1}>{item.lastMessage}</Text>
            <Text className="text-xs text-gray-500">{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
