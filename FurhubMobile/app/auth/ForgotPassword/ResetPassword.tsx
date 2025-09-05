import { View, Text, TouchableOpacity } from "react-native";
import Layout from "@/components/Layouts/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CustomToast from "@/components/CustomToast";
import InputPassword from "@/components/Inputs/InputPassword";
import { useForgotPassword } from "@/context/ForgotPasswordProvider";
import { ResetPassword as reset_password } from "@/services/ForgotPasswordAPI";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";
import { parseError } from "@/utils/parseError";
import React, { useState } from "react";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const { userEmail, remove_email } = useForgotPassword();
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const params = useLocalSearchParams<{ email: string }>();
  const email = params?.email || userEmail || "";

  const passwordValidator = Yup.object().shape({
    new_password: Yup.string()
      .required("Password is required")
      .matches(/[A-Z]/, "Password must have atleast one uppercase letter")
      .matches(/[a-z]/, "Password must have atleast one lowercase letter")
      .matches(/[0-9]/, "Password must have atleast one number")
      .matches(
        /[!@#$%^&*]/,
        "Password must have atleast special characters (!@#$%^&*)"
      ),
    confirm_password: Yup.string()
      .required("Confirm password required")
      .oneOf([Yup.ref("new_password")], "Password does not match"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(passwordValidator), mode: "onChange" });

  const resetPassword = async (data: any) => {
    setLoading(true);
    const { new_password, confirm_password } = data;
    try {
      // api call
      const payload = {
        email: String(email),
        new_password: String(new_password),
        confirm_password: String(confirm_password),
      };

      const result = await reset_password(payload);
      console.log(result);

      remove_email();

      router.replace("/auth/LoginPage");
    } catch (error: any) {
      // error message
      console.log("error:", error);
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
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

      {/* Header */}
      <View className="h-[12rem] w-full justify-start items-start">
        <Text className="ml-[40px] mt-[70px] text-[45px] text-gray-200 font-poppins">
          Reset Password
        </Text>
      </View>

      {/* form Container */}
      <View className="w-[90%] mx-auto bg-white rounded-xl p-9">
        <Text className="text-lg text-gray-600 mb-5">
          Enter your new password below. Make sure it's strong and secure.
        </Text>

        {/* Password */}
        <Text className="text-xl text-black font-poppins mt-1">Password</Text>
        <InputPassword
          control={control}
          name="new_password"
          placeholder="Enter your password"
        />
        {errors.new_password && (
          <Text className="text-red-600 mt-1">
            {errors.new_password.message}
          </Text>
        )}

        {/* Confrim Password */}
        <Text className="text-xl text-black font-poppins mt-1">
          Confirm Password
        </Text>
        <InputPassword
          control={control}
          name="confirm_password"
          placeholder="Confirm password"
        />
        {errors.confirm_password && (
          <Text className="text-red-600 mt-1">
            {errors.confirm_password.message}
          </Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          className="mt-6 bg-indigo-500 py-3 rounded-full"
          onPress={handleSubmit(resetPassword)}>
          <Text className="text-white text-center font-extrabold">
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
