import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  duration: number;
  onHide: () => void;
};

const CustomToast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onHide,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (isMounted) onHide();
      });
    }, duration);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const getIcon = () => {
    switch (type) {
      case "success":
        return { name: "check-circle", color: "#22c55e" }; // green
      case "error":
        return { name: "times-circle", color: "#ef4444" }; // red
      case "info":
      default:
        return { name: "info-circle", color: "#3b82f6" }; // blue
    }
  };

  const icon = getIcon();

  return (
    <Animated.View
      className="absolute top-12 z-50 left-12 right-12 py-4 px-6 rounded-xl bg-[#E9E8E8] gap-2 flex-row justify-center items-center"
      style={{ opacity: fadeAnim }}>
      <FontAwesome name={icon.name as any} size={20} color={icon.color} />
      <Text className="text-black font-bold text-center">{message}</Text>
    </Animated.View>
  );
};

export default CustomToast;
