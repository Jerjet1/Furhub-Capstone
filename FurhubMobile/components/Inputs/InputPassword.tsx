import { View, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import React, { useState } from "react";

type Props = {
  control: any;
  name: string;
  placeholder?: string;
};

export default function InputPassword({ control, name, placeholder }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex-row items-center border-b border-gray-500">
            <TextInput
              className="text-lg font-poppins py-2 flex-1"
              placeholder={placeholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              secureTextEntry={!showPassword}
              autoComplete="off"
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
        )}
      />
    </View>
  );
}
