import { Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type Props = {
  onResend: any;
  timerDuration?: number;
};

const resendTimer = 240;

export default function ResendButton({
  onResend,
  timerDuration = resendTimer,
}: Props) {
  const [timer, setTimer] = useState(0);
  const [resend, setResend] = useState(true);

  useEffect(() => {
    const checkExpiry = async () => {
      const storeExpiry = await SecureStore.getItem("resendExpiry");
      if (storeExpiry) {
        const remainingTime = Math.floor(
          (Number(storeExpiry) - Date.now()) / 1000
        );
        if (remainingTime > 0) {
          setTimer(remainingTime);
          setResend(false);
        } else {
          setResend(true);
          await SecureStore.deleteItemAsync("resendExpiry");
        }
      }
    };
    checkExpiry();
  }, []);

  useEffect(() => {
    let interval: any = null;

    if (!resend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResend(true);
            SecureStore.deleteItemAsync("resendExpiry");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resend, timer]);

  const handleResend = async () => {
    try {
      await onResend();
      const expiry = Date.now() + timerDuration * 1000;
      await SecureStore.setItemAsync("resendExpiry", String(expiry));
      setResend(false);
      setTimer(timerDuration);
    } catch (error: any) {
      console.log("Resend failed: ", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleResend} disabled={!resend}>
      <Text
        className={`${resend ? "text-blue-500 underline " : "text-gray-400"}`}>
        {resend ? "Resend" : `Resend in ${timer}s`}
      </Text>
    </TouchableOpacity>
  );
}
