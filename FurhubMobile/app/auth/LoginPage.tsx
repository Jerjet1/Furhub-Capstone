import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActivityIndicator } from "react-native";
import { login } from "@/services/api";
import Layout from "@/components/Layouts/Layout";
import * as Yup from "yup";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import CustomToast from "@/components/CustomToast";

export default function LoginPage() {
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: setUserAuth } = useAuth();
  const formValidation = Yup.object().shape({
    email: Yup.string().email("invalid email").required("Email is required"),
    password: Yup.string().required("password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formValidation), mode: "onChange" });

  const userLogin = async (data: any) => {
    setLoading(true);
    try {
      const result = await login(data); // result should include token and roles
      console.log("login successfully", result);

      // Save token and roles in context
      const token = result.access;
      const roles = result.roles || []; // Adjust based on your backend response

      setUserAuth(token, roles); // Update AuthContext

      // Redirect based on role
      if (roles.includes("Owner")) {
        router.replace("/(owner)/Home");
      } else if (roles.includes("Walker")) {
        router.replace("/(walker)/Home");
      } else {
        // fallback
        router.replace("/auth/LoginPage");
      }
    } catch (error: any) {
      console.log("Login error:", error);
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

      if (
        error?.details === "Account not verified." ||
        message.toLowerCase().includes("not verified")
      ) {
        // Optional: pass email to verification page
        router.push({
          pathname: "/auth/VerificationPage",
          params: { email: data.email },
        });
        return;
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
        {/* Loading Overlay */}
        {loading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-black/20">
            <ActivityIndicator size={50} color="black" />
            <Text className="text-black mt-3 text-xl">Logging...</Text>
          </View>
        )}

        {/* Toast message */}
        {toast && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onHide={() => setToast(null)}
          />
        )}

        {/* Header */}
        <View className="h-[12rem] w-full justify-start items-start">
          <Text className="ml-[40px] mt-[70px] text-[45px] text-gray-200 font-poppins">
            Login
          </Text>
        </View>

        {/* Form Container */}
        <View className="w-[80%] mx-auto bg-white rounded-xl p-9">
          {/* Email */}
          <Text className="text-xl text-black font-poppins">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="sample@mail.com"
                  keyboardType="email-address"
                  className="border-b border-gray-500 text-lg font-poppins"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoComplete="off"
                />
                {errors.email && (
                  <Text className="text-red-600 mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </>
            )}
          />

          {/* Password */}
          <Text className="mt-4 text-xl font-poppins text-black">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View className="flex-row items-center border-b border-gray-500">
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    className="text-lg font-poppins py-2 flex-1"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoComplete="off"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-3">
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#6b7280"
                    />
                  </Pressable>
                </View>
                {errors.password && (
                  <Text className="text-red-600 mt-2">
                    {errors.password.message}
                  </Text>
                )}
              </>
            )}
          />

          {/* Forgot password */}
          <TouchableOpacity className="self-end mt-2">
            <Text className="text-blue-500 text-base">Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign in Button */}
          <TouchableOpacity
            className="mt-6 bg-indigo-500 py-3 rounded-full"
            onPress={handleSubmit(userLogin)}>
            <Text className="text-white text-center font-extrabold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer (Register Link) */}
        <View className="flex-row justify-center mt-[80px] mb-10">
          <Text className="text-lg">Don't have an account yet?</Text>
          <TouchableOpacity
            // onPress={() => router.replace("/auth/Forms/RoleSelectionPage")}>
            onPress={() => router.replace("/auth/Forms/RoleSelectionPage")}>
            <Text className="text-blue-600 text-lg"> Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
}
