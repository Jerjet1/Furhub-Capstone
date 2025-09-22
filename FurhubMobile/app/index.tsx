import { Text, View, ActivityIndicator } from "react-native";
import "@/global.css";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthProvider";
import { useAuth } from "@/context/useAuth";
export default function Index() {
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) return;

    // Check if auth state has been determined
    if (!user?.is_verified) {
      router.replace("/auth/VerificationPage");
    }

    // Redirect based on role
    if (user?.activeRole === "Owner") {
      router.replace("/(owner)/Home");
    } else if (user?.activeRole === "Walker") {
      router.replace("/(walker)/Home");
    } else {
      router.replace("/auth/Unauthorize");
    }
  }, [user, isInitialized]);
  return null;
}
