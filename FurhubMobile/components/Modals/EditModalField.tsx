import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomToast from "@/components/CustomToast";
import React from "react";

type EditModalFieldProps = {
  visible: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  toast?: { message: string; type?: "success" | "error" | "info" } | null;
  clearToast?: () => void;
};

export default function EditModalField({
  visible,
  onClose,
  label,
  children,
  toast,
  clearToast,
}: EditModalFieldProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-white">
        {/* Header with title and close button */}
        <View className="flex-row items-center justify-between p-5 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            {/* <Ionicons name="close" size={28} color="#4B5563" /> */}
            <Text className="text-black font-medium text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold">{label}</Text>
          <View className="w-12 h-10" />
        </View>
        {/* Content area */}
        <ScrollView className="flex-1 p-5">{children}</ScrollView>
        {toast && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={2000}
            onHide={clearToast || (() => {})}
          />
        )}
      </View>
    </Modal>
  );
}
