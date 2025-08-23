import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/FontAwesome";

type ProfilePictureProps = {
  initialImage?: string;
  onChange: (uri: string) => void;
  onUpload: (uri: string) => Promise<void>;
  isLoading?: boolean;
};

export default function ProfileImage({
  initialImage,
  onChange,
  onUpload,
  isLoading = false,
}: ProfilePictureProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      // Validate file type
      const uriLower = asset.uri.toLowerCase();
      const isAllowedExtension =
        uriLower.endsWith(".jpg") ||
        uriLower.endsWith(".jpeg") ||
        uriLower.endsWith(".png");

      if (!isAllowedExtension) {
        Alert.alert(
          "Invalid File Type",
          "Please select only JPG, JPEG, or PNG files."
        );
        return;
      }

      // Set temporary image for preview
      setTempImage(asset.uri);
      setModalVisible(true);
    }
  };

  const handleSave = async () => {
    if (tempImage) {
      setImage(tempImage);
      onChange(tempImage);

      try {
        await onUpload(tempImage);
      } catch (error) {
        Alert.alert("Upload Error", "Failed to upload image");
        // Revert to previous image if upload fails
        setImage(image);
        onChange(image || "");
      }
    }
    setModalVisible(false);
    setTempImage(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setTempImage(null);
  };

  return (
    <View className="items-center justify-center mt-4">
      <TouchableOpacity onPress={pickImage} disabled={isLoading}>
        {image ? (
          <Image
            source={{ uri: image || initialImage }}
            className="rounded-full w-44 h-44"
            resizeMode="cover"
          />
        ) : (
          <View className="rounded-full bg-white/80 w-40 h-40 items-center justify-center">
            <Ionicons name="user" size={100} color="gray" />
          </View>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/30 rounded-full">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {/* camera overlay - hidden during loading */}
        {!isLoading && (
          <View className="absolute inset-0 items-center justify-center">
            <View className="bg-black/20 rounded-full p-3 w-full h-full items-center justify-center">
              <Ionicons name="camera" size={30} color="white" />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 items-center w-80">
            <Text className="text-lg font-bold mb-4">
              Confirm Profile Picture
            </Text>

            {tempImage && (
              <Image
                source={{ uri: tempImage }}
                className="rounded-full w-32 h-32 mb-6"
                resizeMode="cover"
              />
            )}

            <Text className="text-center mb-6">
              Do you want to use this as your profile picture?
            </Text>

            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                onPress={handleCancel}
                className="bg-gray-300 px-6 py-3 rounded-lg">
                <Text className="font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                className="bg-blue-500 px-6 py-3 rounded-lg">
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
