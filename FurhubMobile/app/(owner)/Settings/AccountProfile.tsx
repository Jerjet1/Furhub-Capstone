import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import ProfileImage from "@/components/ProfileImage";
import CustomToast from "@/components/CustomToast";
import { useAuth } from "@/context/useAuth";
import { uploadImageAPI } from "@/services/imageUpload";

export default function AccoutProfile() {
  const { user, fetchUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  // Fetch profile image on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      if (!user?.profileImage) {
        const imageUrl = await fetchUserProfile();
        if (imageUrl) {
          setProfileImage(imageUrl);
        }
      }
    };

    loadProfileImage();
  }, [user]);

  const handleImageChange = (uri: string) => {
    console.log("Image changed to:", uri);
    // Handle the image change logic here, e.g., update state or send to server
    setProfileImage(uri);
  };

  const handleImageUpload = async (uri: string) => {
    setIsLoading(true);
    try {
      const profileImageData = new FormData();
      // Use the uri passed from ProfileImage, not the state
      const imageUri = uri || profileImage;

      if (!imageUri) {
        throw new Error("No image selected");
      }

      // Get file extension
      const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";

      profileImageData.append("category", "profile_picture");
      profileImageData.append("label", "Profile Picture");
      profileImageData.append("image", {
        uri: imageUri,
        name: `profile_${Date.now()}.${fileExtension}`,
        type: `image/${fileExtension === "png" ? "png" : "jpeg"}`,
      } as any);

      await uploadImageAPI(profileImageData);

      // Refresh the profile image after upload
      const newImageUrl = await fetchUserProfile();
      if (newImageUrl) {
        setProfileImage(newImageUrl);
      }

      setToast({
        message: "Image uploaded successfully!",
        type: "success",
      });
    } catch (error: any) {
      let message = "Login failed. Please try again.";

      if (typeof error === "string") {
        message = error;
      } else if (typeof error.details === "string") {
        message = error.details;
      } else if (typeof error.detail === "string") {
        message = error.detail;
      } else if (typeof error.message === "string") {
        message = error.message;
      } else if (Array.isArray(error)) {
        message = error.join("\n");
      } else if (typeof error === "object") {
        message = Object.values(error).flat().join("\n");
      }
      setToast({
        message: message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 p-3 gap-3 bg-white">
      {/* Toast component */}
      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onHide={() => setToast(null)}
        />
      )}

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        {/* Back button */}
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => router.replace("/(owner)/Settings/SettingScreen")}>
          <Ionicons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        {/* Centered title */}
        <Text className="text-[25px] font-semibold text-center flex-1">
          Profile
        </Text>

        {/* Placeholder for symmetry */}
        <View className="w-10 h-10" />
      </View>

      {/* Profile content */}
      <View className="items-center justify-center mt-4">
        <ProfileImage
          initialImage={profileImage}
          onChange={handleImageChange}
          onUpload={handleImageUpload}
          isLoading={isLoading}
        />
        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-[20px] font-semibold">John Doe</Text>
          <TouchableOpacity className="ml-2">
            <Ionicons name="pencil" size={19} color="#E05D5B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info sections */}
      <View className="flex-1 bg-white p-4 mt-4">
        {/* Email */}
        <View className="flex-row items-center justify-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 mr-2">
            Email:
          </Text>
          <View className="flex-1 items-center">
            <Text className="text-[17px]">john.doe@example.com</Text>
          </View>
        </View>

        {/* Phone number */}
        <View className="flex-row items-center justify-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 mr-2">
            Phone No.:
          </Text>
          <View className="flex-1 items-center">
            <Text className="text-[17px]">09123456789</Text>
          </View>
          <TouchableOpacity className="ml-3">
            <Ionicons name="pencil" size={19} color="#E05D5B" />
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View className="flex-row items-center justify-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 mr-7">
            Address:
          </Text>
          <View className="flex-1 items-start">
            <Text className="text-[17px]">
              Purok 9, Quezon Ave. barangay paknaan Mandaue City
            </Text>
          </View>
          <TouchableOpacity className="ml-3">
            <Ionicons name="pencil" size={19} color="#E05D5B" />
          </TouchableOpacity>
        </View>

        {/* Password */}
        <View className="flex-row items-center justify-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 mr-2">
            Password
          </Text>
          <View className="flex-1 items-center">
            <TouchableOpacity
              className="px-2"
              onPress={() =>
                router.replace("/(owner)/Settings/ChangePassword")
              }>
              <Text className="text-rose-400 underline text-[19px]">
                Change Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
