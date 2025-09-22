import { View, Text, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomToast from "@/components/CustomToast";
import Layout from "@/components/Layouts/Layout";
import { verifyEmailAPI } from "@/services/api";
import React, { useState } from "react";
import ResendButton from "@/components/Buttons/ResendButton";
import InputOTP from "@/components/Inputs/InputOTP";
import { ActivityIndicator } from "react-native";
import { useAuth } from "@/context/useAuth";
import { ResendCode } from "@/utils/ResendCode";
import { parseError } from "@/utils/parseError";

export default function VerificationPage() {
  const [loading, setLoading] = useState(false);
  const { registerUser, logout, user } = useAuth();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params?.email || user?.email || "";
  const [value, setValue] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    if (value.length !== 6) return;
    setLoading(true);
    try {
      const payload = {
        email: String(email),
        code: value,
      };

      const result = await verifyEmailAPI(payload);
      const token = result.access;
      const roles = result.roles || [];
      const refresh = result.refresh;
      registerUser(
        token,
        roles,
        true,
        email,
        result.pet_walker?.status || "",
        refresh
      );

      console.log("Verified!", result);
      setToast({ message: "Email verified successfully!", type: "success" });

      // ✅ Redirect based on role
      if (roles.includes("Owner")) {
        router.replace("/(owner)/Home");
      } else if (roles.includes("Walker")) {
        router.replace("/auth/PendingProviders");
      } else {
        router.replace("/auth/LoginPage"); // fallback
      }
    } catch (error: any) {
      // catch error
      console.log("Verification error");
      setToast({
        message: parseError(error),
        type: "error",
      });
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

      {/* loading State */}
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-black/20">
          <ActivityIndicator size={50} color="black" />
        </View>
      )}

      {/* back button */}
      <View className="h-[10rem] w-full justify-start items-start">
        <TouchableOpacity
          className="ml-[20px] mt-4"
          onPress={() => {
            logout();
            SecureStore.deleteItemAsync("resendExpiry");
          }}>
          <FontAwesome name="long-arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-[30px] mt-[10px] text-[37px] text-gray-200 font-poppins">
          Account Verification
        </Text>
      </View>

      {/* form container */}
      <View className="flex justify-center items-start w-[95%] mx-auto h-[23rem] bg-white rounded-xl p-9 mt-2 gap-4">
        <View className="flex justify-start items-start">
          <Text className="text-xl color-neutral-500">
            Code has been sent to your email:
          </Text>
          <Text className="text-xl">{email}</Text>
          <Text className="text-lg color-neutral-500 mt-5">
            Enter the 6-digit verification code
          </Text>
        </View>

        {/* Verification Input */}
        <InputOTP value={value} setValue={setValue} />

        {/* Resend Button for verification code */}
        <View className="flex flex-row justify-center items-center gap-1">
          <Text>Didn't receive the code?</Text>
          <ResendButton
            onResend={async () => {
              const result = await ResendCode({ email });
              setToast({
                message: result.message,
                type: result.success ? "success" : "error",
              });
            }}
          />
        </View>

        {/* Submit Button */}
        <View className="w-full items-center justify-center mt-5">
          <TouchableOpacity
            className={`w-28 items-center p-2 rounded-xl ${
              value.length === 6 ? "bg-indigo-400 " : "bg-gray-300"
            }`}
            disabled={value.length !== 6}
            onPress={handleSubmit}>
            <Text
              className={`text-lg text-white font-semibold ${
                value.length !== 6 && "opacity-60"
              }`}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
