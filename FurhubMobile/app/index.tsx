import { Text, View } from "react-native";
import "@/global.css";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-green-300">
      <Text className="bg-slate-400">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
