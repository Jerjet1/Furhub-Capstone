import { View, Text, TouchableOpacity } from "react-native";
import Layout from "@/components/Layouts/Layout";
import { ScrollView } from "react-native-gesture-handler";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputEmail from "@/components/Inputs/InputEmail";
import React, { useState } from "react";
import { useForgotPassword } from "@/context/ForgotPasswordProvider";
import { ForgotPasswordAPI } from "@/services/ForgotPasswordAPI";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";
import CustomToast from "@/components/CustomToast";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const { set_email } = useForgotPassword();

  const emailValidation = Yup.object().shape({
    email: Yup.string().email("invalid email").required("Email is required"),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(emailValidation), mode: "onChange" });

  const sendVerification = async (data: any) => {
    setLoading(true);
    const { email } = data;
    try {
      const result = await ForgotPasswordAPI({ email });
      console.log(result);
      set_email(email);
      router.replace({
        pathname: "/auth/ForgotPassword/VerifyCode",
        params: { email: email },
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 200, // Extra space for keyboard
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* display message */}
        {toast && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onHide={() => setToast(null)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-black/20">
            <ActivityIndicator size={50} color="black" />
          </View>
        )}

        {/* back button */}
        <View className="w-full justify-start items-start">
          <TouchableOpacity
            className="ml-[20px] mt-4"
            onPress={() => router.replace("/auth/LoginPage")}>
            <FontAwesome name="long-arrow-left" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* header */}
        <View className="h-[9rem] w-full justify-start items-start">
          <Text className="ml-[30px] mt-[30px] text-[45px] text-gray-200 font-poppins text">
            Forgot Password
          </Text>
        </View>

        {/* Email */}
        <View className="w-[90%] mx-auto bg-white rounded-xl p-9">
          <Text className="text-lg text-gray-600">
            Enter your email to send verification code.
          </Text>
          <View className="mt-3">
            <Text>Email Address</Text>
            <InputEmail
              control={control}
              name="email"
              placeholder="JohnDoe@mail.com"
            />
            {/* error message */}
            {errors.email && (
              <Text className="text-red-600 mt-1">{errors.email.message}</Text>
            )}
          </View>

          <TouchableOpacity
            className="mt-6 bg-indigo-500 py-3 rounded-full"
            onPress={handleSubmit(sendVerification)}>
            <Text className="text-white text-center font-extrabold">
              Send Verification
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
}
