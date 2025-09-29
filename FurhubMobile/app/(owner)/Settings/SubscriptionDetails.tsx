import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function SubscriptionDetails() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    date?: string;
  }>();

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 px-4 pb-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-blue-600">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Subscription Details</Text>
        <Text className="text-gray-500">Review subscription event</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <View className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <Text className="text-base font-semibold" numberOfLines={1}>{params.title || "Subscription Event"}</Text>
            <Text className="text-xs text-gray-500">{params.date || ""}</Text>
          </View>

          <View className="px-4 py-3">
            <Text className="text-xs text-gray-500">Event ID</Text>
            <Text className="text-[15px] font-medium">{params.id || "-"}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
