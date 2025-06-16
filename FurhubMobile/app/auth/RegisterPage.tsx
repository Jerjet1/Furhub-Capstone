import {
  View,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { registerUser } from "@/services/api";
export default function RegisterPage({ navigation }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formValidation = Yup.object().shape({
    first_name: Yup.string().required("Fill this field"),
    last_name: Yup.string().required("Fill this field"),
    phone_no: Yup.string()
      .required("fill this field")
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digit"),
    email: Yup.string().email("invalid email").required("Email is required"),
    password: Yup.string()
      .required("password is required")
      .matches(/[A-Z]/, "Password must have atleast one uppercase letter")
      .matches(/[a-z]/, "Password must have atleast one lowercase letter")
      .matches(/[0-9]/, "Password must have atleast one number")
      .matches(
        /[!@#$%^&*]/,
        "Password must have atleast special characters (!@#$%^&*)"
      ),
    confirm_password: Yup.string()
      .required("Confirm password required")
      .oneOf([Yup.ref("password")], "Password does not match"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formValidation), mode: "onChange" });

  const registerForm = async (data: any) => {
    setLoading(true);
    try {
      const result = await registerUser(data);
      console.log("Success", result);
      // return result;
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1">
            <View className="flex bg-indigo-500 h-[30%] w-full">
              <TouchableOpacity
                className="mt-[50px] ml-[20px]"
                onPress={() => navigation.replace("Login")}>
                <Ionicons name="long-arrow-left" size={30} color={"white"} />
              </TouchableOpacity>
              <Text className=" ml-[50px] text-[45px] text-gray-200 font-poppins">
                Registration
              </Text>
            </View>

            {/* Floating container for forms */}
            <View className="absolute border border-gray-500 items-center justify-center z-50 top-[150px] left-[40px] w-[80%] h-fit bg-white rounded-xl">
              <View className="w-full py-1 px-5 m-3">
                <View className="flex-row justify-between gap-4">
                  {/* First name Input */}
                  <View className="flex-1">
                    <Text className="text-xl text-black font-poppins">
                      First Name
                    </Text>
                    <Controller
                      control={control}
                      name="first_name"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <>
                          <TextInput
                            placeholder="First Name"
                            keyboardType="default"
                            className="border-b border-gray-500 text-lg font-poppins"
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text)}
                            value={value}
                            autoCapitalize="none"
                            autoComplete="off"
                          />
                          {errors.first_name && (
                            <Text className="text-red-600 mt-1">
                              {errors.first_name.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  {/* Last name input */}
                  <View className="flex-1">
                    <Text className="text-xl text-black font-poppins">
                      Last Name
                    </Text>
                    <Controller
                      control={control}
                      name="last_name"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <>
                          <TextInput
                            placeholder="Last Name"
                            keyboardType="default"
                            className="border-b border-gray-500 text-lg font-poppins"
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text)}
                            value={value}
                            autoCapitalize="none"
                            autoComplete="off"
                          />
                          {errors.last_name && (
                            <Text className="text-red-600 mt-1">
                              {errors.last_name.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>
                </View>

                {/* Phone no. Input */}
                <Text className="text-xl text-black font-poppins mt-1">
                  Phone No.
                </Text>
                <Controller
                  control={control}
                  name="phone_no"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        placeholder="09"
                        keyboardType="phone-pad"
                        className="border-b border-gray-500 text-lg font-poppins"
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(text)}
                        value={value}
                        autoCapitalize="none"
                        autoComplete="off"
                        maxLength={11}
                      />
                      {errors.phone_no && (
                        <Text className="text-red-600 mt-1">
                          {errors.phone_no.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                {/* Email Input */}
                <Text className="text-xl text-black font-poppins mt-1">
                  Email
                </Text>
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

                {/* Password Input */}
                <Text className="text-xl text-black font-poppins mt-1">
                  Password
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <View className="border-b border-gray-500 flex-row items-center">
                        <TextInput
                          placeholder="Password"
                          keyboardType="default"
                          secureTextEntry={!showPassword}
                          className="font-poppins text-lg py-2 flex-1"
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          autoCorrect={false}
                          autoComplete="off"
                        />
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                          className="px-3">
                          <Icon
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#6b7280"
                          />
                        </Pressable>
                      </View>
                      {errors.password && (
                        <Text className="text-red-600 mt-1">
                          {errors.password.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                {/* Confirmation Password Input */}
                <Text className="text-xl text-black font-poppins mt-1">
                  Confirmation Password
                </Text>
                <Controller
                  control={control}
                  name="confirm_password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <View className="border-b border-gray-500 flex-row items-center">
                        <TextInput
                          placeholder="Confirm Password"
                          keyboardType="default"
                          secureTextEntry={!showConfirmPassword}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          autoComplete="off"
                          className="font-poppins text-lg py-2 flex-1"
                        />
                        <Pressable
                          onPress={() =>
                            setshowConfirmPassword(!showConfirmPassword)
                          }
                          className="px-3">
                          <Icon
                            name={showConfirmPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#6b7280"
                          />
                        </Pressable>
                      </View>
                      {errors.confirm_password && (
                        <Text className="text-red-600 mt-1">
                          {errors.confirm_password.message}
                        </Text>
                      )}
                    </>
                  )}
                />
                {loading && (
                  <View className="absolute top-0 left-0 right-0 bottom-0  z-50 justify-center items-center">
                    <ActivityIndicator size={50} color="black" />
                    <Text className="text-black mt-3 text-xl">
                      Registering...
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  className="bg-indigo-500 p-4 rounded-full mt-5 border border-blue-400"
                  onPress={handleSubmit(registerForm)}>
                  <Text className="text-center text-lg text-white font-semibold">
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="h-[70%] w-full bg-slate-300 p-[20px]" />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
