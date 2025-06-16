import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActivityIndicator } from "react-native";
import { login } from "@/services/api";
import * as Yup from "yup";
import React, { useState } from "react";

export default function LoginPage({ navigation }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const result = await login(data);
      console.log("login successfully", result);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <View className="flex bg-indigo-500 h-[30%] w-full">
            <Text className="mt-[70px] ml-[40px] text-[45px] text-gray-200 font-poppins">
              Sign In
            </Text>
          </View>
          {loading && (
            <View className="absolute top-0 left-0 right-0 bottom-0  z-50 justify-center items-center">
              <ActivityIndicator size={50} color="black" />
              <Text className="text-black mt-3 text-xl">Logging...</Text>
            </View>
          )}
          <View className="absolute items-center justify-center z-50 top-[170px] left-[40px] w-[80%] h-fit bg-white rounded-xl">
            <View className="w-full p-5 mt-5">
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
                      onChangeText={(text) => onChange(text)}
                      value={value}
                      autoCapitalize="none"
                    />
                    {errors.email && (
                      <Text className="text-red-600 mt-1">
                        {errors.email.message}
                      </Text>
                    )}
                  </>
                )}
              />
              <Text className="mt-2 text-xl font-poppins text-black">
                Password
              </Text>
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
              <View className="flex justify-end items-end mt-2">
                <TouchableOpacity>
                  <Text className="text-blue-500 text-base">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="mt-6 bg-indigo-500 py-3 rounded-full"
                onPress={handleSubmit(userLogin)}>
                <Text className="text-white text-center font-extrabold">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex justify-center items-center bg-slate-300 h-[70%] w-full">
            <View className="flex-row w-full items-center justify-center px-4">
              <Text className="text-lg">Don't have account yet?</Text>
              <TouchableOpacity
                onPress={() => navigation.replace("Registration")}>
                <Text className="text-blue-600 text-lg"> Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
