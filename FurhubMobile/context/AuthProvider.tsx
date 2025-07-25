import { logout as LogoutAPI } from "@/services/api";
import { router } from "expo-router";
import { useState, createContext, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const ROLES = {
  OWNER: "Owner",
  WALKER: "Walker",
};

type CurrentUser = {
  id: number;
  name: string;
  role: 'owner' | 'walker';
};


type AuthContextType = {
  user: {
    token: string;
    roles: string[];
    activeRole: string;
  } | null;
  login: (token: string, roles: string[]) => void;
  setActiveRole: (role: string) => void;
  logout: () => void;
  isInitialized: boolean;
  currentUser: CurrentUser | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

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

      if (token && roles) {
        setUser({
          token,
          roles: JSON.parse(roles),
          activeRole: activeRole || JSON.parse(roles)[0],
        });
      }
      setIsInitialized(true);
    };
    loadUserFromStorage();
  }, []);

  const login = async (token: string, roles: string[]) => {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("roles", JSON.stringify(roles));
    await SecureStore.setItemAsync("activeRole", roles[0]); // optional
    setUser({ token, roles, activeRole: roles[0] });
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

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("roles");
    await SecureStore.deleteItemAsync("activeRole");
    await LogoutAPI();
    setUser(null);
    router.replace("/auth/LoginPage");
  };

  const currentUser: CurrentUser | null = user
  ? {
      id: user.activeRole === ROLES.OWNER ? 1 : 2, // Later: pull from backend
      name: user.activeRole,
      role: user.activeRole.toLowerCase() as 'owner' | 'walker',
    }
  : null;



  return (
    <AuthContext.Provider
      value={{ user, login, logout, setActiveRole, isInitialized, currentUser, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
