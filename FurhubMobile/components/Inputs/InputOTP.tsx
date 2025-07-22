import { View, Text } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import React from "react";

type Props = {
  value: string;
  setValue: (text: string) => void;
  cellCount?: number;
};
const cells_Count = 6;

export default function InputOTP({
  value,
  setValue,
  cellCount = cells_Count,
}: Props) {
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View className="w-full items-start">
      {/* <Text className="text-lg mb-2">{label}</Text> */}
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={cellCount}
        rootStyle={{ marginTop: 20, gap: 12 }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            className={`w-12 h-14 border-2 rounded-xl justify-center items-center
                      ${isFocused ? "border-indigo-500" : "border-gray-300"}`}>
            <Text className="text-2xl text-black">
              {symbol || (isFocused ? <Cursor /> : "")}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
