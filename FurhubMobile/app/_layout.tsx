import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RegistrationProvider } from "@/context/RegistrationProvider";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
          <RegistrationProvider>
            <RootLayoutNav />
          </RegistrationProvider>
        </AuthProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
