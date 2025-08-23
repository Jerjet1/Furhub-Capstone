import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";

export default function PetProfile() {
  return (
    <View>
      <TouchableOpacity
        onPress={() => router.replace("/(owner)/Settings/SettingScreen")}>
        <Text>Back</Text>
      </TouchableOpacity>
      <Text>PetProfile</Text>
    </View>
  );
}
