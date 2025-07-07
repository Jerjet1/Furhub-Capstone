import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      {/* Background views outside KeyboardAvoidingView */}
      <View className="absolute top-0 left-0 right-0 h-[30%] bg-indigo-600" />
      <View className="absolute top-[30%] left-0 right-0 bottom-0 bg-neutral-100" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
