import { View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface forgotPasswordType {
  userEmail: string | null;
  set_email: (email: string) => void;
  remove_email: () => void;
}

const forgotPasswordContext = createContext<forgotPasswordType | null>(null);

export const ForgotPasswordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadEmailStorage = async () => {
      const storedEmail = await SecureStore.getItemAsync("email");
      setUserEmail(storedEmail);
    };
    loadEmailStorage();
  }, []);

  const set_email = async (email: string) => {
    await SecureStore.setItemAsync("email", email);
    setUserEmail(email);
  };

  const remove_email = async () => {
    await SecureStore.deleteItemAsync("email");
    setUserEmail(null);
  };

  return (
    <forgotPasswordContext.Provider
      value={{ userEmail, set_email, remove_email }}>
      {children}
    </forgotPasswordContext.Provider>
  );
};

export const useForgotPassword = () => {
  const context = useContext(forgotPasswordContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
