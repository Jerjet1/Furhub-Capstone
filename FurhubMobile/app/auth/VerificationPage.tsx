import { View, Text, TouchableOpacity } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useLocalSearchParams, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomToast from "@/components/CustomToast";
import Layout from "@/components/Layout";
import { resendCodeAPI, verifyEmailAPI } from "@/services/api";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";

const CELL_COUNT = 6;
const resendTimer = 240;

export default function VerificationPage() {
  const { login: setUserAuth } = useAuth();
  const { email } = useLocalSearchParams();
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(resendTimer);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (timer === 0) {
      setResendAvailable(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async () => {
    if (value.length !== 6) return;
    try {
      const payload = {
        email: String(email),
        code: value,
      };

      const result = await verifyEmailAPI(payload);
      const token = result.access;
      const roles = result.roles || [];

      setUserAuth(token, roles);

      console.log("Verified!", result);
      setToast({ message: "Email verified successfully!", type: "success" });

      // ✅ Redirect based on role
      if (roles.includes("Owner")) {
        router.replace("/(owner)/Home");
      } else if (roles.includes("Walker")) {
        router.replace("/(walker)/Home");
      } else {
        router.replace("/auth/LoginPage"); // fallback
      }
    } catch (error: any) {
      // catch error
      let message = "Verification failed";
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
      setToast({ message, type: "error" });
    }
  };

  const handleResend = async () => {
    try {
      if (!resendAvailable) return;
      const result = await resendCodeAPI(String(email));
      console.log("Resending code...");
      setToast({ message: result.message, type: "success" });
      setTimer(resendTimer);
      setResendAvailable(false);
    } catch (error: any) {
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

  return (
    <Layout>
      {/* error message */}
      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onHide={() => setToast(null)}
        />
      )}
      <View className="h-[10rem] w-full justify-start items-start">
        <TouchableOpacity
          className="ml-[20px] mt-4"
          onPress={() => router.replace("/auth/LoginPage")}>
          <FontAwesome name="long-arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-[30px] mt-[10px] text-[37px] text-gray-200 font-poppins">
          Account Verification
        </Text>
      </View>
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
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={{ marginTop: 20, gap: 12 }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              className={`w-12 h-14 border-2 rounded-xl justify-center items-center
              ${isFocused ? "border-indigo-500" : "border-gray-300"}`}>
              <Text className="text-2xl text-black">
                {symbol || (isFocused ? <Cursor /> : "")}
              </Text>
            </View>
          )}
        />
        <View className="flex justify-center items-center">
          {resendAvailable ? (
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-indigo-600 font-semibold">Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-neutral-500">
              Resend time in: {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </Text>
          )}
        </View>
        <View className="w-full items-center justify-center">
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
