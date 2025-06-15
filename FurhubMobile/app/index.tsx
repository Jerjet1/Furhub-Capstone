import { Text, View } from "react-native";
import "@/global.css";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function Index() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Registration" component={RegisterPage} />
    </Stack.Navigator>
  );
}
