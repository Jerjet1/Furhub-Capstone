// app/(owner)/Home.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

export default function Home() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="font-bold text-[40px]">Owner Home</Text>

      <TouchableOpacity
        onPress={() => router.push('/chat')}
        className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
      > 
        <Text className="text-white text-lg">Go to Chat</Text>
      </TouchableOpacity>
    </View>
  );
}
