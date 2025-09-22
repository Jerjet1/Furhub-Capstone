import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
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
import { userDetailsAPI } from "@/services/userAPI";
import { changePasswordAPI } from "@/services/api";
import React, { useState, useEffect } from "react";

const validationSchema = {
  name: Yup.object().shape({
    first_name: Yup.string().required("First name os required"),
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
};

const MODAL_TYPES = {
  NONE: "NONE",
  NAME: "NAME",
  PHONE: "PHONE",
  PASSWORD: "PASSWORD",
};

export default function AccountProfile() {
  const { userDetails, profilePicture, loading, error, refreshProfile } =
    useProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(MODAL_TYPES.NONE);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [modalToast, setModalToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  type FormFields = {
    first_name?: string;
    last_name?: string;
    phone_no?: string;
    old_password?: string;
    new_password?: string;
    confirm_password?: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormFields>({
    resolver: yupResolver(
      activeModal === MODAL_TYPES.NAME
        ? validationSchema.name
        : activeModal === MODAL_TYPES.PHONE
        ? validationSchema.phone
        : activeModal === MODAL_TYPES.PASSWORD
        ? validationSchema.password
        : Yup.object()
    ),
    mode: "onChange",
  });

  const phone_no = watch("phone_no");
  const [first_name, last_name] = watch(["first_name", "last_name"]);
  const [old_password, new_password, confirm_password] = watch([
    "old_password",
    "new_password",
    "confirm_password",
  ]);

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
    }
  }, [activeModal, userDetails, reset]);

  const closeModal = () => {
    setActiveModal(MODAL_TYPES.NONE);
    reset();
  };

  const handleImageUpload = async (uri: string) => {
    setIsLoading(true);
    try {
      const profileImageData = new FormData();
      const fileExtension =
        uri.split(".").pop()?.toLowerCase() || "jpg" || "png" || "jpeg";

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
      setModalToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameUpdate = async (data: any) => {
    setIsLoading(true);
    try {
      const payload: any = {};
      if (data.first_name) payload.first_name = data.first_name;
      if (data.last_name) payload.last_name = data.last_name;

      await userDetailsAPI.updateUser(payload);
      await refreshProfile();

      setToast({ message: "Name update successfully!", type: "success" });
      closeModal();
    } catch (error: any) {
      setModalToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneUpdate = async (data: any) => {
    setIsLoading(true);
    try {
      await userDetailsAPI.updateUser({ phone_no: data.phone_no });
      await refreshProfile();

      setToast({
        message: "Phone number updated successsfully!",
        type: "success",
      });
      closeModal();
    } catch (error: any) {
      setModalToast({ message: parseError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await changePasswordAPI(data);

      setToast({ message: result.details, type: "success" });
      closeModal();
    } catch (error: any) {
      setModalToast({ message: parseError(error), type: "error" });
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
                disable={phone_no === userDetails?.phone_no || !phone_no}
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
      default:
        return "";
    }
  };

  if (loading)
    return (
      <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-black/20">
        <ActivityIndicator size={50} color="black" />
      </View>
    );
  if (error)
    return (
      <View className="flex justify-center items-center">
        <Text className="text-red-500 text-center mt-10">{error}</Text>
      </View>
    );

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
          onPress={() => router.replace("/(walker)/Settings/SettingScreen")}>
          <Ionicons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-[25px] font-semibold text-center flex-1">
          Profile
        </Text>
        <View className="w-10 h-10" />
      </View>

      {/* Profile Picture, Name */}
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
      </View>

      {/* Modal for all edit operations */}
      <EditModalField
        visible={activeModal !== MODAL_TYPES.NONE}
        onClose={closeModal}
        label={getModalLabel()}
        toast={modalToast}
        clearToast={() => setModalToast(null)}>
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
