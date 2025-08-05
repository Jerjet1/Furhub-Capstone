import React from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const RatingDetails = () => {
  const { reviewer, serviceType, rating, reviewText, date } = useLocalSearchParams();

  return (
    <ScrollView className="p-4 bg-white flex-1">
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-blue-500 mb-4">← Back to Reviews</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-2">Purrbaby Palace @ Woodlands</Text>
      <Text className="text-sm text-gray-700 mb-2">by Purrbaby ⭐⭐⭐⭐⭐ (7 Reviews)</Text>
      <Text className="text-sm text-green-600 mb-4">✅ 6 Completed Bookings</Text>
      <Text className="text-sm text-gray-600">📍 Woodlands, Singapore | Pet Boarding</Text>

      {/* Photos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-4">
        {[1, 2, 3, 4].map((_, index) => (
          <Image
            key={index}
            source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual image URLs
            className="w-24 h-24 mr-2 rounded-lg"
          />
        ))}
      </ScrollView>

      {/* Review */}
      <View className="bg-gray-100 p-4 rounded-xl mb-6">
        <Text className="text-base font-semibold">{reviewer}</Text>
        <Text className="text-sm text-gray-700">{serviceType}</Text>
        <Text className="text-yellow-500 text-lg mt-1">{'⭐'.repeat(Number(rating))}</Text>
        <Text className="text-sm mt-2">{reviewText}</Text>
        <Text className="text-xs text-gray-500 mt-1">{date}</Text>
      </View>

      {/* About */}
      <Text className="text-lg font-bold mb-2">About</Text>
      <Text className="text-sm text-gray-700 mb-2">
        Salam.. Hi.. I'm Zain. A cat lover since childhood. Offering cat-boarding based in Woodlands...
      </Text>

      {/* Certifications */}
      <Text className="text-lg font-bold mb-2">Skills and Certifications</Text>
      <Text className="text-sm text-gray-700">✔️ Basic understanding of how to manage and care for pets</Text>
      <Text className="text-sm text-gray-700">✔️ I can do basic grooming like bath & trim nails for the cats.</Text>
    </ScrollView>
  );
};

export default RatingDetails;
