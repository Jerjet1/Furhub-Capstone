import { View, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import React from "react";

type Props = {
  control: any;
  name: string;
  placeholder?: string;
};

export default function InputName({ control, name, placeholder }: Props) {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border-b border-gray-500 text-lg font-poppins"
            placeholder={placeholder}
            value={value}
            keyboardType="default"
            onBlur={onBlur}
            onChangeText={onChange}
            autoComplete="off"
          />
        )}
      />
    </View>
  );
}
