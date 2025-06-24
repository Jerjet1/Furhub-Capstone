import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <Stack.Screen name="auth/LoginPage" options={{ headerShown: false }} />
      ) : user.activeRole === "Owner" ? (
        <Stack.Screen name="(owner)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(walker)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
