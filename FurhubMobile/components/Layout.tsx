import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout({ children }: { children: ReactNode }) {
  const inset = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Top container color */}
          <View className="absolute top-0 left-0 right-0 h-[30%] bg-indigo-600" />
          <View className="absolute top-[30%] left-0 right-0 bottom-0 bg-slate-100" />
          {children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
