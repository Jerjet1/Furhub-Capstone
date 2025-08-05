import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';

const EditReview = () => {
  const params = useLocalSearchParams();

  const [reviewer, setReviewer] = useState(params.reviewer?.toString() || '');
  const [serviceType, setServiceType] = useState(params.serviceType?.toString() || '');
  const [rating, setRating] = useState(params.rating?.toString() || '');
  const [reviewText, setReviewText] = useState(params.reviewText?.toString() || '');
  const [date, setDate] = useState(params.date?.toString() || '');

  const handleUpdate = () => {
    Alert.alert('Updated!', 'Your review has been updated.');
    router.back(); // Go back to ratings screen
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Edit Review</Text>

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
        placeholder="Service Type"
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
        placeholder="Date"
      />

      <TouchableOpacity
        onPress={handleUpdate}
        className="bg-green-600 p-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditReview;
