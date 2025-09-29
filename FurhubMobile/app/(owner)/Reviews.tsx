import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Reviews() {
  const [activeTab, setActiveTab] = useState('my-reviews');
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [selectedService, setSelectedService] = useState('Cozy Pet Hotel');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const reviews = [
    {
      id: 1,
      reviewerName: "Sarah Johnson",
      petName: "Max",
      rating: 4.5,
      date: "January 15, 2024",
      provider: "Happy Paws Boarding",
      reviewText: "Absolutely wonderful experience! The staff was incredibly caring and my dog Max came home happy.",
      providerResponse: "Thank you so much Sarah! Max was a joy to have with us!"
    }

    
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      let starColor = "text-gray-300";
      if (i <= fullStars || (i === fullStars + 1 && hasHalfStar)) {
        starColor = "text-orange-500";
      }
      stars.push(
        <FontAwesome key={i} name="star" size={16} className={starColor + " mr-1"} />
      );
    }
    return stars;
  };

  const renderReviewCard = (review: any, isMyReview = false) => (
    <View key={review.id} className="bg-white rounded-xl p-4 mb-4 shadow border border-gray-200">
      {/* Header Row */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <Text className="font-semibold text-gray-800 text-base mr-2">{review.reviewerName}</Text>
          <View className="bg-blue-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">Pet: {review.petName}</Text>
          </View>
        </View>
        {isMyReview && (
          <View className="flex-row">
            <TouchableOpacity className="p-2 mr-1">
              <FontAwesome name="edit" size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <FontAwesome name="trash" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Rating & Date */}
      <View className="flex-row items-center mb-2">
        <View className="flex-row mr-3">{renderStars(review.rating)}</View>
        <Text className="text-gray-500 text-sm">{review.date}</Text>
      </View>

      {/* Provider */}
      <Text className="text-blue-600 font-medium mb-2 text-sm">{review.provider}</Text>

      {/* Review Text */}
      <Text className="text-gray-700 mb-3 leading-5 text-sm">{review.reviewText}</Text>

      {/* Provider Response */}
      {review.providerResponse && (
        <View className="bg-yellow-100 border-l-4 border-orange-500 p-3 rounded-md mt-2">
          <Text className="font-semibold text-gray-800 text-sm mb-1">Provider Response 💬</Text>
          <Text className="text-gray-700 text-sm leading-5">{review.providerResponse}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-yellow-100">
      {/* Header */}
      <View className="bg-white px-5 py-4 shadow">
        <Text className="text-2xl font-bold text-gray-800 mb-1">Reviews & Ratings</Text>
        <Text className="text-gray-500 text-base">Manage your pet boarding reviews</Text>
      </View>

      {/* Tabs */}
      <View className="bg-white mx-4 mt-4 rounded-xl p-1 shadow flex-row">
        <TouchableOpacity
          onPress={() => setActiveTab('my-reviews')}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === 'my-reviews' ? 'bg-orange-100 border border-orange-400' : ''
          }`}
        >
          <Text className={`text-center font-semibold text-base ${
            activeTab === 'my-reviews' ? 'text-orange-600' : 'text-gray-500'
          }`}>
            My Reviews
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => setActiveTab('browse-reviews')}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === 'browse-reviews' ? 'bg-orange-100 border border-orange-400' : ''
          }`}
        >
          <Text className={`text-center font-semibold text-base ${
            activeTab === 'browse-reviews' ? 'text-orange-600' : 'text-gray-500'
          }`}>
            Browse Reviews
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'my-reviews' ? (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">Your Reviews</Text>
            {reviews.map(review => renderReviewCard(review, true))}
          </>
        ) : (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">All Reviews</Text>
            {reviews.map(review => renderReviewCard(review))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
