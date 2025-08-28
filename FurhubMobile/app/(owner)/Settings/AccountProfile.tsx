import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import ProfileImage from "@/components/ProfileImage";
import CustomToast from "@/components/CustomToast";
import EditModalField from "@/components/Modals/EditModalField";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputName from "@/components/Inputs/InputName";
import { uploadImageAPI } from "@/services/imageUpload";
import { parseError } from "@/utils/parseError";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { useProfile } from "@/context/profile/useProfile";
import InputPhone from "@/components/Inputs/InputPhone";
import InputPassword from "@/components/Inputs/InputPassword";
// import { updateProfileAPI, changePasswordAPI } from "@/services/profileApi"; // Assume these API functions exist

// Validation schemas
const validationSchemas = {
  name: Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
  }),
  phone: Yup.object().shape({
    phone_no: Yup.string()
      .required("Phone number is required")
      .matches(
        /^09[0-9]{9}$/,
        "Phone number must start with 09 and be 11 digits"
      ),
  }),
  password: Yup.object().shape({
    old_password: Yup.string().required("Current password is required"),
    new_password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[a-z]/, "Password must have at least one lowercase letter")
      .matches(/[0-9]/, "Password must have at least one number")
      .matches(
        /[!@#$%^&*]/,
        "Password must have at least one special character (!@#$%^&*)"
      ),
    confirm_password: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("new_password")], "Passwords do not match"),
  }),
  emergency_no: Yup.object().shape({
    emergency_phone_no: Yup.string()
      .required("Phone number is required")
      .matches(
        /^09[0-9]{9}$/,
        "Phone number must start with 09 and be 11 digits"
      ),
  }),
};

// Modal types
const MODAL_TYPES = {
  NONE: "NONE",
  NAME: "NAME",
  PHONE: "PHONE",
  PASSWORD: "PASSWORD",
  EMERGENCY: "EMERGENCY",
  BIO: "BIO",
};

export default function AccountProfile() {
  const {
    userDetails,
    profilePicture,
    petOwnerDetails,
    loading,
    error,
    refreshProfile,
  } = useProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(MODAL_TYPES.NONE);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  // Define form field types
  type FormFields = {
    first_name?: string;
    last_name?: string;
    phone_no?: string;
    old_password?: string;
    new_password?: string;
    confirm_password?: string;
    emergency_phone_no?: string;
    bio?: string;
  };

  // Main form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormFields>({
    resolver: yupResolver(
      activeModal === MODAL_TYPES.NAME
        ? validationSchemas.name
        : activeModal === MODAL_TYPES.PHONE
        ? validationSchemas.phone
        : activeModal === MODAL_TYPES.PASSWORD
        ? validationSchemas.password
        : activeModal === MODAL_TYPES.EMERGENCY
        ? validationSchemas.emergency_no
        : Yup.object()
    ),
    mode: "onChange",
  });

  const phoneNum = watch("phone_no");
  const [first_name, last_name] = watch(["first_name", "last_name"]);
  const [old_password, new_password, confirm_password] = watch([
    "old_password",
    "new_password",
    "confirm_password",
  ]);
  const emergency_no = watch("emergency_phone_no");
  const bio = watch("bio");

  // Reset form when modal changes or userDetails updates
  useEffect(() => {
    if (activeModal === MODAL_TYPES.NAME) {
      reset({
        first_name: userDetails?.first_name || "",
        last_name: userDetails?.last_name || "",
      });
    } else if (activeModal === MODAL_TYPES.PHONE) {
      reset({
        phone_no: userDetails?.phone_no || "",
      });
    } else if (activeModal === MODAL_TYPES.PASSWORD) {
      reset({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } else if (activeModal === MODAL_TYPES.EMERGENCY) {
      reset({
        emergency_phone_no: petOwnerDetails?.emergency || "",
      });
    }
  }, [activeModal, userDetails, reset]);

  const closeModal = () => {
    setActiveModal(MODAL_TYPES.NONE);
    reset();
  };

  // Handles logic for image Upload
  const handleImageUpload = async (uri: string) => {
    setIsLoading(true);
    try {
      const profileImageData = new FormData();
      const fileExtension = uri.split(".").pop()?.toLowerCase() || "jpg";

      profileImageData.append("category", "profile_picture");
      profileImageData.append("label", "Profile Picture");
      profileImageData.append("image", {
        uri,
        name: `profile_${Date.now()}.${fileExtension}`,
        type: `image/${fileExtension === "png" ? "png" : "jpeg"}`,
      } as any);

      await uploadImageAPI(profileImageData);
      await refreshProfile();

      setToast({ message: "Image uploaded successfully!", type: "success" });
    } catch (error: any) {
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handles logic for updates
  const handleNameUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      // await updateProfileAPI({
      //   first_name: data.first_name,
      //   last_name: data.last_name,
      // });
      await refreshProfile();
      setToast({ message: "Name updated successfully!", type: "success" });
      closeModal();
    } catch (error: any) {
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      // await updateProfileAPI({ phone_no: data.phone_no });
      await refreshProfile();
      setToast({
        message: "Phone number updated successfully!",
        type: "success",
      });
      closeModal();
    } catch (error: any) {
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyPhoneUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      setToast({
        message: "Phone number updated successfully!",
        type: "success",
      });
      closeModal();
    } catch (error: any) {
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      // await changePasswordAPI({
      //   old_password: data.old_password,
      //   new_password: data.new_password,
      // });
      setToast({ message: "Password changed successfully!", type: "success" });
      closeModal();
    } catch (error: any) {
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      setToast({ message: "Bio update successfully!", type: "success" });
    } catch (error: any) {
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case MODAL_TYPES.NAME:
        return (
          <View className="gap-5 px-2">
            <View className="min-h-[80px]">
              <Text className="text-lg font-medium">First Name</Text>
              <InputName control={control} name="first_name" />
              <View className="min-h-[24px]">
                {errors.first_name && (
                  <Text className="text-red-600">
                    {errors.first_name.message}
                  </Text>
                )}
              </View>
            </View>
            <View className="min-h-[80px]">
              <Text className="text-lg font-medium">Last Name</Text>
              <InputName control={control} name="last_name" />
              <View className="min-h-[24px]">
                {errors.last_name && (
                  <Text className="text-red-600">
                    {errors.last_name.message}
                  </Text>
                )}
              </View>
            </View>
            <View className="flex items-center justify-center w-full mt-3">
              <SubmitButton
                onPress={handleSubmit(handleNameUpdate)}
                title="Save Changes"
                disable={
                  (first_name === userDetails?.first_name &&
                    last_name === userDetails?.last_name) ||
                  !first_name ||
                  !last_name
                }
              />
            </View>
          </View>
        );

      case MODAL_TYPES.PHONE:
        return (
          <View className="gap-5 px-2">
            <View className="min-h-[80px]">
              <Text className="text-lg font-medium">Phone No</Text>
              <InputPhone control={control} name="phone_no" placeholder="+09" />
              <View className="min-h-[24px]">
                {errors.phone_no && (
                  <Text className="text-red-600">
                    {errors.phone_no.message}
                  </Text>
                )}
              </View>
            </View>
            <View className="flex items-center justify-center w-full mt-3">
              <SubmitButton
                onPress={handleSubmit(handlePhoneUpdate)}
                title="Save Changes"
                disable={phoneNum === userDetails?.phone_no || !phoneNum}
              />
            </View>
          </View>
        );

      case MODAL_TYPES.PASSWORD:
        return (
          <View className="gap-5 px-2">
            <View className="min-h-[80px]">
              <Text className="text-lg font-medium">Old Password</Text>
              <InputPassword control={control} name="old_password" />
              <View className="min-h-[24px]">
                {errors.old_password && (
                  <Text className="text-red-600">
                    {errors.old_password.message}
                  </Text>
                )}
              </View>
            </View>
            <View className="min-h-[80px]">
              <Text className="text-lg font-medium">New Password</Text>
              <InputPassword control={control} name="new_password" />
              <View className="min-h-[24px]">
                {errors.new_password && (
                  <Text className="text-red-600">
                    {errors.new_password.message}
                  </Text>
                )}
              </View>
            </View>
            <View className="min-h-[80px]">
              <Text className="text-lg font-medium">Confirm Password</Text>
              <InputPassword control={control} name="confirm_password" />
              <View className="min-h-[24px]">
                {errors.confirm_password && (
                  <Text className="text-red-600">
                    {errors.confirm_password.message}
                  </Text>
                )}
              </View>
            </View>
            <View className="flex items-center justify-center w-full mt-3">
              <SubmitButton
                onPress={handleSubmit(handlePasswordUpdate)}
                title="Save Changes"
                disable={
                  !old_password ||
                  !new_password ||
                  new_password !== confirm_password
                }
              />
            </View>
          </View>
        );

      case MODAL_TYPES.EMERGENCY:
        return (
          <View className="gap-5 px-2">
            <View className="min-h-[80px]">
              <Text className="text-lg font-medium">Emergency phone no.</Text>
              <InputPhone
                control={control}
                name="emergency_phone_no"
                placeholder="+09"
              />
              <View className="min-h-[24px]">
                {errors.emergency_phone_no && (
                  <Text className="text-red-600">
                    {errors.emergency_phone_no.message}
                  </Text>
                )}
              </View>
            </View>
            <View className="flex items-center justify-center w-full mt-3">
              <SubmitButton
                onPress={handleSubmit(handleEmergencyPhoneUpdate)}
                title="Save Changes"
                disable={
                  emergency_no === petOwnerDetails?.emergency || !emergency_no
                }
              />
            </View>
          </View>
        );

      case MODAL_TYPES.BIO:
        return (
          <View className="gap-5 px-2">
            <View className="min-h-[80px]">
              <Controller
                name="bio"
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    className="w-full h-44 border border-gray-400 rounded-lg p-5"
                    multiline
                    maxLength={200}
                    textAlignVertical="top"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Write Something about yourself"
                  />
                )}
              />
            </View>
            <View className="flex items-center justify-center w-full mt-3">
              <SubmitButton
                onPress={handleSubmit(handleBioUpdate)}
                title="Save Changes"
                disable={bio === petOwnerDetails?.bio || !bio}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const getModalLabel = () => {
    switch (activeModal) {
      case MODAL_TYPES.NAME:
        return "Edit Name";
      case MODAL_TYPES.PHONE:
        return "Edit Phone No";
      case MODAL_TYPES.PASSWORD:
        return "Change Password";
      case MODAL_TYPES.EMERGENCY:
        return "Emergency No.";
      case MODAL_TYPES.BIO:
        return "Edit Bio";
      default:
        return "";
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (error)
    return <Text className="text-red-500 text-center mt-10">{error}</Text>;

  return (
    <View className="flex-1 p-3 gap-3 bg-white">
      {/* Toast */}
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
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => router.replace("/(owner)/Settings/SettingScreen")}>
          <Ionicons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-[25px] font-semibold text-center flex-1">
          Profile
        </Text>
        <View className="w-10 h-10" />
      </View>

      {/* Profile Picture, Name and Bio */}
      <View className="items-center justify-center mt-4">
        <ProfileImage
          initialImage={profilePicture || ""}
          onChange={() => {}}
          onUpload={handleImageUpload}
          isLoading={isLoading}
        />
        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-[20px] font-semibold">
            {userDetails?.first_name} {userDetails?.last_name}
          </Text>
          <TouchableOpacity
            className="ml-2"
            onPress={() => setActiveModal(MODAL_TYPES.NAME)}>
            <Ionicons name="pencil" size={19} color="#E05D5B" />
          </TouchableOpacity>
        </View>
        <View className="flex items-center justify-center w-80 h-20 rounded-lg border border-gray-300 mt-2">
          <TouchableOpacity onPress={() => setActiveModal(MODAL_TYPES.BIO)}>
            <Text className="text-gray-400">
              {petOwnerDetails?.bio || "Write something about yourself ^^"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for all edit operations */}
      <EditModalField
        visible={activeModal !== MODAL_TYPES.NONE}
        onClose={closeModal}
        label={getModalLabel()}>
        {renderModalContent()}
      </EditModalField>

      {/* Info sections */}
      <View className="flex-1 bg-white p-4 mt-3">
        {/* Email */}
        <View className="flex-row items-center justify-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 w-28">
            Email:
          </Text>
          <Text className="text-[17px] flex-1">{userDetails?.email}</Text>
        </View>

        {/* Phone number */}
        <View className="flex-row items-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 w-28">
            Phone No.:
          </Text>
          <Text className="text-[17px] flex-1">{userDetails?.phone_no}</Text>
          <TouchableOpacity
            className="ml-3"
            onPress={() => setActiveModal(MODAL_TYPES.PHONE)}>
            <Ionicons name="pencil" size={19} color="#E05D5B" />
          </TouchableOpacity>
        </View>

        {/* Emergency Contact */}
        <View className="flex-row items-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 w-28">
            Emergency No:
          </Text>
          <Text className="text-[17px] flex-1">
            {petOwnerDetails?.emergency || "+09"}
          </Text>
          <TouchableOpacity
            className="ml-3"
            onPress={() => setActiveModal(MODAL_TYPES.EMERGENCY)}>
            <Ionicons name="pencil" size={19} color="#E05D5B" />
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View className="flex-row items-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 w-28">
            Address:
          </Text>
          <Text className="text-[17px] flex-1">
            {userDetails?.address || "No address set"}
          </Text>
          <TouchableOpacity className="ml-3">
            <Ionicons name="pencil" size={19} color="#E05D5B" />
          </TouchableOpacity>
        </View>

        {/* Password */}
        <View className="flex-row items-center mb-4 border-b border-gray-300 pb-3">
          <Text className="text-[17px] font-semibold text-gray-400 w-28">
            Password
          </Text>
          <TouchableOpacity
            onPress={() => setActiveModal(MODAL_TYPES.PASSWORD)}>
            <Text className="text-rose-400 underline text-[19px]">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
