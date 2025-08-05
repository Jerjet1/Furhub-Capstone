import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';

const PostReview = () => {
  const [reviewer, setReviewer] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [date, setDate] = useState('');

  const handlePost = () => {
    if (!reviewer || !serviceType || !rating || !reviewText || !date) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    Alert.alert('Success', 'Review has been posted!');
    router.back(); // Navigate back to ratings list
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Post a Review</Text>

      <Text className="font-semibold">Reviewer</Text>
      <TextInput
        value={reviewer}
        onChangeText={setReviewer}
        className="border p-2 rounded mb-4"
        placeholder="Reviewer Name"
      />

      <Text className="font-semibold">Service Type</Text>
      <TextInput
        value={serviceType}
        onChangeText={setServiceType}
        className="border p-2 rounded mb-4"
        placeholder="e.g. Grooming | Katie’s Doggie Grooming"
      />

      <Text className="font-semibold">Rating (1-5)</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        className="border p-2 rounded mb-4"
        placeholder="Rating"
        keyboardType="numeric"
      />

      <Text className="font-semibold">Review</Text>
      <TextInput
        value={reviewText}
        onChangeText={setReviewText}
        className="border p-2 rounded mb-4"
        placeholder="Write your review"
        multiline
      />

      <Text className="font-semibold">Date</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        className="border p-2 rounded mb-6"
        placeholder="e.g. July 28, 2025"
      />

      <TouchableOpacity
        onPress={handlePost}
        className="bg-blue-600 p-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Submit Review</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostReview;
