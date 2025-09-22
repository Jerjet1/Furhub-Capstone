import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthProvider";
import { useAuth } from "@/context/useAuth";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RegistrationProvider } from "@/context/RegistrationProvider";
import { ForgotPasswordProvider } from "@/context/ForgotPasswordProvider";
import { ProfileProvider } from "@/context/profile/profileProvider";

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
        <Stack.Screen name="auth/LoginPage" />
      ) : !user?.is_verified ? (
        <Stack.Screen name="auth/VerificationPage" />
      ) : user.activeRole?.toLowerCase() === "owner" ? (
        <Stack.Screen name="(owner)" />
      ) : user.activeRole?.toLowerCase() === "walker" ? (
        <Stack.Screen name="(walker)" />
      ) : (
        <Stack.Screen name="auth/Unauthorize" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={"default"} />
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
          <RegistrationProvider>
            <ForgotPasswordProvider>
              <ProfileProvider>
                <RootLayoutNav />
              </ProfileProvider>
            </ForgotPasswordProvider>
          </RegistrationProvider>
        </AuthProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
