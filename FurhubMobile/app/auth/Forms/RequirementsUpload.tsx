import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import ProgressIndicator from "@/components/ProgressIndicator";
import Layout from "@/components/Layouts/Layout";
import { router, useLocalSearchParams } from "expo-router";
import CustomToast from "@/components/CustomToast";
import { registerUserAPI, requirementsUpload } from "@/services/api";
import { useRegistration } from "@/context/RegistrationProvider";
import { useAuth } from "@/context/AuthProvider";
import React, { useState, useEffect } from "react";

export default function RequirementsUpload() {
  const { role } = useLocalSearchParams<{ role: "Owner" | "Walker" }>();
  const [barangayClearance, setBarangayClearance] = useState<any>(null);
  const [validID, setValidID] = useState<any>(null);
  const [selfieWithID, setSelfieWithID] = useState<any>(null);
  const { uploadedImages, setUploadedImages, formData, setFormData } =
    useRegistration();
  const { registerUser } = useAuth();

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  useEffect(() => {
    setBarangayClearance(uploadedImages.barangayClearance);
    setValidID(uploadedImages.validID);
    setSelfieWithID(uploadedImages.selfieWithID);
  }, []);

  // choosing a photo in gallery
  const pickImage = async (
    setImageFn: (img: any) => void,
    imageKey: keyof typeof uploadedImages
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // updated to avoid warning
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const file = result.assets[0];

      // You can also check the extension from the URI if needed
      const mimeType = file.mimeType || ""; // iOS might not include this, use fallback if needed
      const fileName = file.fileName || file.uri.split("/").pop() || "";
      const extension = fileName.split(".").pop()?.toLowerCase();

      if (
        allowedTypes.includes(mimeType) ||
        ["jpg", "jpeg", "png"].includes(extension || "")
      ) {
        setImageFn(file);
        setUploadedImages((prev) => ({
          ...prev,
          [imageKey]: file,
        }));
      } else {
        setToast({
          message: "Only JPG, JPEG, and PNG files are allowed.",
          type: "error",
        });
      }
    }
  };

  const handleSubmit = async () => {
    const data = formData;

    // Checks if all fields has been filled
    if (!barangayClearance || !validID || !selfieWithID) {
      setToast({
        message: "Please upload all required documents.",
        type: "error",
      });
      return;
    }

    // sending data into API
    try {
      // Account Details
      const result = await registerUserAPI({ ...data, role });
      const is_verified = result.is_verified === true;
      console.log(
        result.access,
        result.roles,
        is_verified,
        result.email,
        result.pet_walker
      );
      registerUser(
        result.access,
        result.roles,
        is_verified,
        result.email,
        result.pet_walker
      );
      // requirements upload
      const user_id = result.user_id;

      // Barangay Clearance
      const barangayFormData = new FormData();
      barangayFormData.append("user", user_id);
      barangayFormData.append("category", "walker_requirement");
      barangayFormData.append("label", "barangay_clearance");
      barangayFormData.append("image", {
        uri: barangayClearance.uri,
        name: "barangay.jpg",
        type: "image/jpeg",
      } as any);
      await requirementsUpload(barangayFormData);

      // Valid ID
      const validIdFormData = new FormData();
      validIdFormData.append("user", user_id);
      validIdFormData.append("category", "walker_requirement");
      validIdFormData.append("label", "valid_id");
      validIdFormData.append("image", {
        uri: validID.uri,
        name: "valid_id.jpg",
        type: "image/jpeg",
      } as any);
      await requirementsUpload(validIdFormData);

      // Selfie with ID
      const selfieFormData = new FormData();
      selfieFormData.append("user", user_id);
      selfieFormData.append("category", "walker_requirement");
      selfieFormData.append("label", "selfie_with_id");
      selfieFormData.append("image", {
        uri: selfieWithID.uri,
        name: "selfie.jpg",
        type: "image/jpeg",
      } as any);
      await requirementsUpload(selfieFormData);
      console.log("Success", result);

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_no: "",
        password: "",
        confirm_password: "",
      });

      setUploadedImages({
        barangayClearance: null,
        validID: null,
        selfieWithID: null,
      });

      router.replace({
        pathname: "/auth/VerificationPage",
        params: { email: data.email },
      });
    } catch (error: any) {
      console.log("error", error);
      let message = "Unexpected error occured";

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
    }
  };

  // Convert the image into filename
  const getFileNameFromUri = (uri: string) => {
    return uri.split("/").pop() ?? "unknown_filename.jpg";
  };

  // remove Button
  const handleRemove = (
    setImageFn: (img: null) => void,
    imageKey: keyof typeof uploadedImages
  ) => {
    setImageFn(null);
    setUploadedImages((prev) => ({
      ...prev,
      [imageKey]: null,
    }));
  };

  // reupload button
  const renderUploadBlock = (
    label: string,
    image: any,
    setImageFn: (img: any) => void,
    imageKey: keyof typeof uploadedImages
  ) => (
    <View className="mb-5">
      <Text className="text-black font-medium mb-1">{label}</Text>

      {image ? (
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-blue-700">
            📄 {getFileNameFromUri(image.uri)}
          </Text>

          <View className="flex-row gap-4 mt-2">
            <TouchableOpacity
              onPress={() => pickImage(setImageFn, imageKey)}
              className="bg-blue-500 px-3 py-1 rounded">
              <Text className="text-white text-sm">Re-upload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRemove(setImageFn, imageKey)}
              className="bg-red-600 px-3 py-1 rounded">
              <Text className="text-white text-sm">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => pickImage(setImageFn, imageKey)}
          className="bg-gray-200 rounded-lg p-3 items-center flex-row justify-center gap-2">
          <Text className="text-gray-600">Tap to upload</Text>
          <FontAwesome name="image" size={20} className="" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {toast && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onHide={() => setToast(null)}
          />
        )}

        {/* Header */}
        <View className="h-[12rem] mt-1 w-full justify-start items-start gap-10">
          <TouchableOpacity
            className="mt-[10px] ml-[20px]"
            onPress={() => {
              setUploadedImages({ barangayClearance, validID, selfieWithID });
              router.replace({
                pathname: "/auth/Forms/RegistrationForm",
                params: { role },
              });
            }}>
            <FontAwesome name="long-arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <ProgressIndicator
            currentStep={3}
            steps={["Choose Role", "Account Details", "Requirements Upload"]}
          />
        </View>

        {/* Upload Fields */}
        <View className="w-[90%] mx-auto bg-white rounded-xl p-5 mt-2">
          {renderUploadBlock(
            "Barangay Clearance",
            barangayClearance,
            setBarangayClearance,
            "barangayClearance"
          )}
          {renderUploadBlock("Valid ID", validID, setValidID, "validID")}
          {renderUploadBlock(
            "Selfie with ID",
            selfieWithID,
            setSelfieWithID,
            "selfieWithID"
          )}
          <View className="w-full justify-center items-center">
            <TouchableOpacity
              className="w-[12rem] bg-indigo-500 py-4 rounded-full"
              onPress={handleSubmit}>
              <Text className="text-center text-lg text-white font-semibold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
