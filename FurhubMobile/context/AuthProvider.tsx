import { logout as LogoutAPI } from "@/services/api";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { setLogoutCallback } from "@/services/axiosInterceptor";
import { ROLES } from "@/constant/roles";
import { fetchProfileAPI } from "@/services/imageUpload";
import { AuthContext, AuthContextType } from "./AuthContex";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = await SecureStore.getItemAsync("token");
      const roles = await SecureStore.getItemAsync("roles");
      const activeRole = await SecureStore.getItemAsync("activeRole");
      const email = await SecureStore.getItemAsync("email");
      const is_verified =
        (await SecureStore.getItemAsync("is_verified")) === "true";
      const status = (await SecureStore.getItemAsync("pet_walker")) || "";
      const refresh = await SecureStore.getItemAsync("refresh");

      console.log(refresh);
      console.log(token);

      if (token && roles) {
        setUser({
          token,
          roles: JSON.parse(roles),
          activeRole: activeRole || JSON.parse(roles)[0],
          is_verified,
          email: email || "",
          status,
          refresh,
        });
        setIsInitialized(true);
      } else {
        setIsInitialized(true);
      }
    };
    loadUserFromStorage();
  }, []);

  const registerUser = async (
    token: string,
    roles: string[],
    is_verified: boolean = false,
    email: string = "",
    status: string = "",
    refresh: string
  ) => {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("roles", JSON.stringify(roles));
    await SecureStore.setItemAsync("activeRole", roles[0]); // optional
    await SecureStore.setItemAsync("is_verified", String(is_verified));
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("pet_walker", status);
    await SecureStore.setItemAsync("refresh", refresh);
    setUser({
      token,
      roles,
      activeRole: roles[0],
      is_verified,
      email,
      status,
      refresh,
    });
  };

  // const fetchUserProfile = async () => {
  //   if (!user) return;

  //   try {
  //     const response = await fetchProfileAPI();

  //     setUser((prev) => (prev ? { ...prev, profileImage: response } : prev));

  //     return response;
  //   } catch (error: any) {
  //     throw error.response?.data || { details: "Something went wrong" };
  //   }
  // };

  // useEffect(() => {
  //   fetchUserProfile();
  // }, []);

  const login = async (
    token: string,
    roles: string[],
    is_verified: boolean = false,
    email: string = "",
    status: string = "",
    refresh: string
  ) => {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("roles", JSON.stringify(roles));
    await SecureStore.setItemAsync("activeRole", roles[0]); // optional
    await SecureStore.setItemAsync("is_verified", String(is_verified));
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("pet_walker", status);
    await SecureStore.setItemAsync("refresh", refresh);
    setUser({
      token,
      roles,
      activeRole: roles[0],
      is_verified,
      email,
      status,
      refresh,
    });
  };

  const setActiveRole = async (role: string) => {
    if (user && user.roles.includes(role)) {
      await SecureStore.setItemAsync("activeRole", role);
      setUser({ ...user, activeRole: role });
      // Navigate based on new role
      if (role === ROLES.OWNER) {
        router.replace("/(owner)/Home");
      } else {
        router.replace("/(walker)/Home");
      }
    }
  };

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("roles");
    await SecureStore.deleteItemAsync("activeRole");
    await SecureStore.deleteItemAsync("email");
    await SecureStore.deleteItemAsync("is_verified");
    await SecureStore.deleteItemAsync("pet_walker");
    await SecureStore.deleteItemAsync("refresh");
    await LogoutAPI();
    setUser(null);
    router.replace("/auth/LoginPage");
  }, []);

  useEffect(() => setLogoutCallback(logout), [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setActiveRole,
        isInitialized,
        registerUser,
        // fetchUserProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
