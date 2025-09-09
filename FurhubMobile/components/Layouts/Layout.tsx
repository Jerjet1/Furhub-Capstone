import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { ReactNode } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      {/* Background views outside KeyboardAvoidingView */}
      <View className="absolute top-0 left-0 right-0 h-72 bg-indigo-600" />
      <View className="absolute h-92 left-0 right-0 bottom-0 bg-neutral-200" />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1 }}>{children}</View>
      </KeyboardAwareScrollView>
    </View>
  );
}
