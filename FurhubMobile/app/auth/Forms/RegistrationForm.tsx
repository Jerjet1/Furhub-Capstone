import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/FontAwesome";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import Layout from "@/components/Layouts/Layout";
import * as Yup from "yup";
import { checkEmailAvailability, registerUserAPI } from "@/services/api";
import CustomToast from "@/components/CustomToast";
import ProgressIndicator from "@/components/ProgressIndicator";
import { useAuth } from "@/context/useAuth";
import { useRegistration } from "@/context/RegistrationProvider";
import InputName from "@/components/Inputs/InputName";
import InputPhone from "@/components/Inputs/InputPhone";
import InputPassword from "@/components/Inputs/InputPassword";
import LocationModal from "./LocationModal";
import { parseError } from "@/utils/parseError";

const formValidation = Yup.object().shape({
  first_name: Yup.string().required("Fill this field"),
  last_name: Yup.string().required("Fill this field"),
  phone_no: Yup.string()
    .required("Fill this field")
    .matches(/^09[0-9]{9}$/, "Phone number must start with 09 and be 11 digit"),
  email: Yup.string().email("invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/[a-z]/, "Password must have at least one lowercase letter")
    .matches(/[0-9]/, "Password must have at least one number")
    .matches(/[!@#$%^&*]/, "Password must have at least one special character (!@#$%^&*)"),
  confirm_password: Yup.string()
    .required("Confirm password required")
    .oneOf([Yup.ref("password")], "Password does not match"),
});

export default function RegistrationForm() {
  const { role } = useLocalSearchParams<{ role: "Owner" | "Walker" }>();
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [location, setLocation] = useState<{
    latitude?: number;
    longitude?: number;
    province?: string;
    city?: string;
    barangay?: string;
    street?: string;
  }>({});
  const { formData, setFormData } = useRegistration();
  const { registerUser } = useAuth();

  const steps = ["Choose Role", "Fill Form"];

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
    if (!location.latitude || !location.longitude) {
      setToast({ message: "Please pick your location", type: "error" });
      return;
    }

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

      const payload = { ...data, role, location };

      const result = await registerUserAPI(payload);
      const is_verified = result.is_verified === true;

      registerUser(result.access, result.roles, is_verified, result.email, result.pet_walker, result.refresh);

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_no: "",
        password: "",
        confirm_password: "",
      });

      router.replace({ pathname: "/auth/VerificationPage", params: { email: result.email } });
      return result;
    } catch (error: any) {
      console.log("error", error);
      setToast({ message: parseError(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="h-[12rem] mt-1 w-full justify-start items-start flex-col gap-10">
          <TouchableOpacity
            className="mt-[25px] ml-[20px]"
            onPress={() => router.replace("/auth/Forms/RoleSelectionPage")}
          >
            <Ionicons name="long-arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <View>
            <ProgressIndicator currentStep={2} steps={steps} />
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-black/20">
            <ActivityIndicator size={50} color="black" />
          </View>
        )}

        {toast && <CustomToast message={toast.message} type={toast.type} duration={3000} onHide={() => setToast(null)} />}

        {/* Form Container */}
        <View className="w-[90%] mx-auto bg-white rounded-xl p-5">
          {/* First & Last Name */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xl text-black font-poppins">First Name</Text>
              <InputName control={control} name="first_name" placeholder="First Name" />
              {errors.first_name && <Text className="text-red-600 mt-1">{errors.first_name.message}</Text>}
            </View>
            <View className="flex-1">
              <Text className="text-xl text-black font-poppins">Last Name</Text>
              <InputName control={control} name="last_name" placeholder="Last Name" />
              {errors.last_name && <Text className="text-red-600 mt-1">{errors.last_name.message}</Text>}
            </View>
          </View>

          {/* Phone Input */}
          <Text className="text-xl text-black font-poppins mt-1">Phone No.</Text>
          <InputPhone control={control} name="phone_no" placeholder="09" />
          {errors.phone_no && <Text className="text-red-600 mt-1">{errors.phone_no.message}</Text>}

          {/* Email Input */}
          <Text className="text-xl text-black font-poppins mt-1">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (emailError) setEmailError("");
                }}
                placeholder="JohnDoe@mail.com"
                className="border-b border-gray-500 text-lg font-poppins"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="off"
              />
            )}
          />
          {emailError && <Text className="text-red-600 mt-1">{emailError}</Text>}
          {errors.email && <Text className="text-red-600 mt-1">{errors.email.message}</Text>}

          {/* Password */}
          <Text className="text-xl text-black font-poppins mt-1">Password</Text>
          <InputPassword control={control} name="password" placeholder="Password" />
          {errors.password && <Text className="text-red-600 mt-1">{errors.password.message}</Text>}

          {/* Confirm Password */}
          <Text className="text-xl text-black font-poppins mt-1">Confirm Password</Text>
          <InputPassword control={control} name="confirm_password" placeholder="Confirm Password" />
          {errors.confirm_password && <Text className="text-red-600 mt-1">{errors.confirm_password.message}</Text>}

          {/* Location Picker */}
          <Text className="text-xl text-black font-poppins mt-3">Location</Text>
          <TouchableOpacity
            className="bg-gray-200 p-3 rounded-md"
            onPress={() => setLocationModalVisible(true)}
          >
            <Text>
              {location.province ? `${location.province}, ${location.city}, ${location.barangay}` : "Pick your location"}
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity className="bg-indigo-500 p-4 rounded-full mt-5" onPress={handleSubmit(registerForm)}>
            <Text className="text-center text-lg text-white font-semibold">
              {role === "Owner" ? "Register" : "Proceed"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location Modal */}
        <LocationModal
          visible={locationModalVisible}
          onClose={() => setLocationModalVisible(false)}
          onSave={(data) => setLocation(data)}
        />
      </ScrollView>
    </Layout>
  );
}
