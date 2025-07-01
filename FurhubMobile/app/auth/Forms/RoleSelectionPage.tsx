import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";
import Layout from "@/components/Layout";
import { FontAwesome } from "@expo/vector-icons";
import ProgressIndicator from "@/components/ProgressIndicator";

export default function RoleSelectionPage() {
  const selectRole = (role: "Owner" | "Walker") => {
    router.replace({
      pathname: "/auth/Forms/RegistrationForm",
      params: { role },
    });
  };
  return (
    <Layout>
      {/* Header */}
      <View className="h-[12rem] mt-1 w-full justify-start items-start flex-col gap-10">
        <TouchableOpacity
          className="mt-[10px] ml-[20px]"
          onPress={() => router.replace("/auth/LoginPage")}>
          <FontAwesome name="long-arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <View>
          <ProgressIndicator
            currentStep={1}
            steps={["Choose Role", "Account details"]}
          />
        </View>
      </View>
      <View className="flex justify-center items-center w-[80%] mx-auto h-[15rem] bg-white rounded-xl p-9 gap-10 mt-2">
        <TouchableOpacity
          className="bg-indigo-500 p-4 w-full rounded-xl"
          onPress={() => selectRole("Owner")}>
          <Text className="text-white text-center text-xl font-bold">
            Pet Owner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-indigo-500 p-4 w-full rounded-xl"
          onPress={() => selectRole("Walker")}>
          <Text className="text-white text-center text-xl font-bold">
            Pet Walker
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
