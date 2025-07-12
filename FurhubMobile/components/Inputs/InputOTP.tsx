import { View, Text } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import React, { useState, useEffect } from "react";

const CELL_COUNT = 6;

export default function InputOTP({ onComplete }: any) {
  const [value, setValue] = useState("");

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleChange = () => {};

  return <View></View>;
}
