import { createContext } from "react";

export type AuthContextType = {
  user: {
    token: string;
    roles: string[];
    activeRole: string;
    is_verified: boolean;
    email: string;
    status: string;
    refresh: string | null;
    profileImage?: string | null;
  } | null;
  login: (
    token: string,
    roles: string[],
    is_verified: boolean,
    email: string,
    status: string,
    refresh: string
  ) => void;
  registerUser: (
    token: string,
    roles: string[],
    is_verified: boolean,
    email: string,
    status: string,
    refresh: string
  ) => void;
  setActiveRole: (role: string) => void;
  fetchUserProfile: () => Promise<string | null>;
  logout: () => void;
  isInitialized: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
