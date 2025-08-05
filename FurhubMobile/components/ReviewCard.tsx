import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

type Props = {
  reviewer: string;
  serviceType: string;
  rating: number;
  reviewText: string;
  date: string;
};

const ReviewCard = ({ reviewer, serviceType, rating, reviewText, date }: Props) => {
  const handlePress = () => {
    router.push(
      `/ratings/ratingdetails?reviewer=${encodeURIComponent(reviewer)}&serviceType=${encodeURIComponent(
        serviceType
      )}&rating=${rating}&reviewText=${encodeURIComponent(reviewText)}&date=${encodeURIComponent(date)}`
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} className="bg-gray-100 p-4 rounded-xl mb-4">
      <Text className="text-base font-semibold">{reviewer}</Text>
      <Text className="text-sm text-gray-700">{serviceType}</Text>
      <Text className="text-yellow-500 text-lg mt-1">{'⭐'.repeat(rating)}</Text>
      <Text className="text-sm mt-2">{reviewText}</Text>
      <Text className="text-xs text-gray-500 mt-1">{date}</Text>
    </TouchableOpacity>
  );
};

export default ReviewCard;
