import { View, Text, TouchableOpacity } from "react-native";
import { useForgotPassword } from "@/context/ForgotPasswordProvider";
import { router, useLocalSearchParams } from "expo-router";
import Layout from "@/components/Layouts/Layout";
import InputOTP from "@/components/Inputs/InputOTP";
import ResendButton from "@/components/Buttons/ResendButton";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { ResendCode } from "@/utils/ResendCode";
import { VerifyCode as verify_code } from "@/services/ForgotPasswordAPI";
import CustomToast from "@/components/CustomToast";
import { ActivityIndicator } from "react-native";
import { parseError } from "@/utils/parseError";

export default function VerifyCode() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const { userEmail, remove_email } = useForgotPassword();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params?.email || userEmail || "";
  const handleSubmit = async () => {
    setLoading(true);
    if (value.length !== 6) return;
    try {
      // call verifyCode api
      const payload = {
        email: String(email),
        code: value,
      };
      const result = await verify_code(payload);
      console.log(result);
      router.replace({
        pathname: "/auth/ForgotPassword/ResetPassword",
        params: { email: email },
      });
    } catch (error: any) {
      // error
      console.log("error: ", error);
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

      {/* back button */}
      <View className="h-[10rem] w-full justify-start items-start">
        <TouchableOpacity
          className="ml-[20px] mt-4"
          onPress={() => {
            remove_email();
            router.replace("/auth/ForgotPassword/ForgotPasswordPage");
          }}>
          <FontAwesome name="long-arrow-left" size={30} color="white" />
        </TouchableOpacity>

        <Text className="ml-[30px] mt-[10px] text-[37px] text-gray-200 font-poppins">
          Confirm your email
        </Text>
      </View>

      {/* form container */}
      <View className="flex justify-center items-start w-[95%] mx-auto h-[23rem] bg-white rounded-xl p-9 mt-2 gap-1">
        <Text className="text-xl color-neutral-500">
          Code has been sent to your email:
        </Text>
        <Text className="text-xl">{email}</Text>
        <Text className="text-lg color-neutral-500 mt-5">
          Enter the 6-digit verification code
        </Text>

        <InputOTP value={value} setValue={setValue} />
        {/* Resend Button for verification code */}
        <View className="flex flex-row justify-center items-center gap-1 mt-2">
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
            className={`w-36 items-center p-2 rounded-xl ${
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
