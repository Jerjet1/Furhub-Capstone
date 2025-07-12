import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Icon from "@expo/vector-icons/Ionicons";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import Layout from "@/components/Layouts/Layout";
import * as Yup from "yup";
import { checkEmailAvailability, registerUserAPI } from "@/services/api";
import CustomToast from "@/components/CustomToast";
import ProgressIndicator from "@/components/ProgressIndicator";
import { ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthProvider";
import { useRegistration } from "@/context/RegistrationProvider";
import React, { useState, useEffect } from "react";

const formValidation = Yup.object().shape({
  first_name: Yup.string().required("Fill this field"),
  last_name: Yup.string().required("Fill this field"),
  phone_no: Yup.string()
    .required("Fill this field")
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digit"),
  email: Yup.string().email("invalid email").required("Email is required"),
  password: Yup.string()
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
    .oneOf([Yup.ref("password")], "Password does not match"),
});

export default function RegistrationForm() {
  const { role } = useLocalSearchParams<{ role: "Owner" | "Walker" }>();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const { formData, setFormData, setUploadedImages } = useRegistration();
  const { registerUser } = useAuth();

  const steps =
    role === "Walker"
      ? ["Choose Role", "Account details", "Upload Requirements"]
      : ["Choose Role", "Fill Form"];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formValidation),
    mode: "onChange",
    defaultValues: formData,
  });

  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) => {
      setValue(key as any, value);
    });
  }, []);

  const registerForm = async (data: any) => {
    setFormData(data);
    setLoading(true);
    setEmailError("");
    try {
      const emailInUse = await checkEmailAvailability(data.email);
      if (emailInUse) {
        setEmailError("Email already in use");
        setLoading(false);
        return;
      }

      if (role === "Walker") {
        router.replace({
          pathname: "/auth/Forms/RequirementsUpload",
          params: { ...data, role }, // pass form data and role
        });
      } else {
        const result = await registerUserAPI({ ...data, role });
        const is_verified = result.is_verified === true;
        console.log(result.email, result.roles, result.pet_walker);

        // Save user data in context
        registerUser(
          result.access,
          result.roles,
          is_verified,
          data.email,
          result.pet_walker
        );

        // ✅ Reset the form after successful registration
        setUploadedImages({
          barangayClearance: null,
          validID: null,
          selfieWithID: null,
        });
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_no: "",
          password: "",
          confirm_password: "",
        });
        // ✅ Optionally clear stored context formData
        console.log("Success", result);
        router.replace({
          pathname: "/auth/VerificationPage",
        });
        // return result;
      }
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
          paddingBottom: 300, // Extra space for keyboard
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="h-[12rem] mt-1 w-full justify-start items-start flex-col gap-10">
          <TouchableOpacity
            className="mt-[25px] ml-[20px]"
            onPress={() => router.replace("/auth/Forms/RoleSelectionPage")}>
            <Ionicons name="long-arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <View>
            <ProgressIndicator currentStep={2} steps={steps} />
          </View>
        </View>

        {toast && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onHide={() => setToast(null)}
          />
        )}
        {/* Form Container (no absolute positioning!) */}
        <View className="w-[85%] mx-auto bg-white rounded-xl p-5">
          {/* First & Last Name Row */}
          <View className="flex-row gap-4">
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
                      className="border-b border-gray-500 text-lg font-poppins"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
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
            <View className="flex-1">
              <Text className="text-xl text-black font-poppins">Last Name</Text>
              <Controller
                control={control}
                name="last_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      placeholder="Last Name"
                      className="border-b border-gray-500 text-lg font-poppins"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
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
          <Text className="text-xl text-black font-poppins mt-1">Email</Text>
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
                  onChangeText={(text) => {
                    setEmailError("");
                    onChange(text);
                  }}
                  value={value}
                  autoCapitalize="none"
                  autoComplete="off"
                />
                {emailError && (
                  <Text className="text-red-600 mt-1">{emailError}</Text>
                )}
                {errors.email && (
                  <Text className="text-red-600 mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </>
            )}
          />

          {/* Password Input */}
          <Text className="text-xl text-black font-poppins mt-1">Password</Text>
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
                    onPress={() => setshowConfirmPassword(!showConfirmPassword)}
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

          {/* Register Button */}
          <TouchableOpacity
            className="bg-indigo-500 p-4 rounded-full mt-5"
            onPress={handleSubmit(registerForm)}>
            {role === "Owner" ? (
              <Text className="text-center text-lg text-white font-semibold">
                Register
              </Text>
            ) : (
              <Text className="text-center text-lg text-white font-semibold">
                Proceed
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Spacer (ensures scrolling works) */}
      </ScrollView>
    </Layout>
  );
}
