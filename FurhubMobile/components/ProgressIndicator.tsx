import { View, Text } from "react-native";
import React from "react";

interface Props {
  currentStep: number;
  steps: string[];
}

export default function ProgressIndicator({ currentStep, steps }: Props) {
  return (
    <View className="flex-row items-center w-full justify-start ml-2">
      {steps.map((step, index) => {
        const isActive = currentStep === index + 1;
        const isCompleted = currentStep > index + 1;

        return (
          <View key={index} className="flex-row items-center">
            {/* Step Circle */}
            <View
              className={`w-10 h-10 rounded-full items-center justify-center
                ${
                  isCompleted
                    ? "bg-green-500"
                    : isActive
                    ? "bg-indigo-900"
                    : "bg-gray-300"
                }`}>
              <Text className="text-white font-bold">
                {isCompleted ? "✓" : index + 1}
              </Text>
            </View>

            {/* Label */}
            <Text className="text-[15px] font-medium text-white w-[80px] ml-2">
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
