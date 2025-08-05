import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import ReviewCard from '../../components/ReviewCard';

const RatingsScreen = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: 'Daniela',
      serviceType: 'Grooming | Katie’a Doggie Grooming',
      rating: 5,
      reviewText: 'Thank you Katie’a',
      date: 'July 25, 2025',
    },
    {
      id: 2,
      reviewer: 'IRENA',
      serviceType: 'Boarding | Brum’s Cozy Companions',
      rating: 5,
      reviewText: 'They took such great care of our puppy!',
      date: 'July 20, 2025',
    },
    {
      id: 3,
      reviewer: 'Yatrik',
      serviceType: 'Boarding | Purrfect Friends!!!',
      rating: 5,
      reviewText: 'Very happy with Zainab’s service.',
      date: 'July 14, 2025',
    },
  ]);

  const handleDelete = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <ScrollView className="p-4 bg-white flex-1">
      <Text className="text-2xl font-bold mb-4">FurHub Reviews</Text>

      {/* Add Review Button */}
      <TouchableOpacity
        onPress={() => router.push('/ratings/post')}
        className="bg-blue-500 p-3 rounded-lg mb-4"
      >
        <Text className="text-white text-center text-base">+ Add Review</Text>
      </TouchableOpacity>

      {/* List of Reviews */}
      {reviews.map((item) => (
        <View key={item.id} className="mb-4">
          <ReviewCard
            reviewer={item.reviewer}
            serviceType={item.serviceType}
            rating={item.rating}
            reviewText={item.reviewText}
            date={item.date}
          />

          {/* Edit / Delete Buttons */}
          <View className="flex-row justify-end space-x-4 mt-1">
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/ratings/edit?id=${item.id}&reviewer=${encodeURIComponent(
                    item.reviewer
                  )}&rating=${item.rating}&reviewText=${encodeURIComponent(
                    item.reviewText
                  )}&serviceType=${encodeURIComponent(
                    item.serviceType
                  )}&date=${encodeURIComponent(item.date)}`
                )
              }
            >
              <Text className="text-blue-600">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text className="text-red-600">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default RatingsScreen;
