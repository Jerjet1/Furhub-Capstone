import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

type buttonProps = {
  onPress: () => void;
  title: string;
  disable?: boolean;
};

export default function SubmitButton({ onPress, title, disable }: buttonProps) {
  return (
    <TouchableOpacity
      className={`p-5 ${
        disable ? "bg-blue-200" : "bg-blue-400"
      }  rounded-lg w-44`}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disable}>
      <Text className="text-center text-base font-medium">{title}</Text>
    </TouchableOpacity>
  );
}
