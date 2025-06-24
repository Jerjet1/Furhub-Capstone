import { Text, View, ActivityIndicator } from "react-native";
import "@/global.css";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
export default function Index() {
  const { user } = useAuth();

  useEffect(() => {
    // Check if auth state has been determined
    if (user?.activeRole === "Owner") {
      router.replace("/(owner)/Home");
    } else if (user?.activeRole === "Walker") {
      router.replace("/(walker)/Home");
    } else {
      router.replace("/auth/LoginPage");
    }
  }, [user]);
  return null;
}
