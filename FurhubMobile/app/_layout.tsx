import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RegistrationProvider } from "@/context/RegistrationProvider";
import {
  ForgotPasswordProvider,
  useForgotPassword,
} from "@/context/ForgotPasswordProvider";

function RootLayoutNav() {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen
          name="auth/LoginPage"
          options={{
            headerShown: false,
          }}
        />
      ) : !user?.is_verified ? (
        <Stack.Screen
          name="auth/VerificationPage"
          options={{ headerShown: false }}
        />
      ) : user.activeRole?.toLowerCase() === "owner" ? (
        <Stack.Screen name="(owner)" options={{ headerShown: false }} />
      ) : user.activeRole?.toLowerCase() === "walker" ? (
        ["pending", "rejected"].includes(user.status) ? (
          <Stack.Screen name="auth/PendingProviders" />
        ) : (
          <Stack.Screen name="(walker)" options={{ headerShown: false }} />
        )
      ) : (
        <Stack.Screen
          name="auth/Unauthorize"
          options={{ headerShown: false }}
        />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
          <RegistrationProvider>
            <ForgotPasswordProvider>
              <RootLayoutNav />
            </ForgotPasswordProvider>
          </RegistrationProvider>
        </AuthProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
