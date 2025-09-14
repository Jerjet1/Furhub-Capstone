import React, { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { setLogoutCallback } from "../api/axiosInterceptor"; // Import the setter
import { ROLES } from "../App";
import { AuthContext } from "./AuthContext";
import axios from "axios";
const axiosInstance = axios.create();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const roles = localStorage.getItem("roles");
        const activeRole = localStorage.getItem("activeRole");

        if (token && roles) {
          const parsedRole = JSON.parse(roles);
          const roleToSet = activeRole || parsedRole[0];
          const is_verified = localStorage.getItem("is_verified") === "true";
          const email = localStorage.getItem("email");
          const pet_boarding_status = localStorage.getItem("pet_boarding");
          setUser({
            token,
            roles: parsedRole,
            activeRole: roleToSet,
            is_verified,
            email,
            pet_boarding_status,
          });
        }
      } catch (error) {
        console.error("Auth load error:", error);
        logout(); // Clear invalid data
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, [navigate]);

  const registerUser = (
    token,
    refreshToken,
    roles,
    is_verified = false,
    email = "",
    pet_boarding_status
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refreshToken);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("is_verified", is_verified ? "true" : "false");
    localStorage.setItem("email", email);
    localStorage.setItem("pet_boarding", pet_boarding_status);

    setUser({ token, roles, is_verified, email, pet_boarding_status });
  };

  const login = (
    token,
    refreshToken,
    roles,
    is_verified = false,
    email = "",
    pet_boarding_status
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refreshToken);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("activeRole", roles[0]);
    localStorage.setItem("is_verified", is_verified ? "true" : "false");
    localStorage.setItem("email", email);
    localStorage.setItem("pet_boarding", pet_boarding_status);

    setUser({
      token,
      roles,
      activeRole: roles[0],
      is_verified,
      email,
      pet_boarding_status,
    });
  };

  const setActiveRole = (role) => {
    if (user && user.roles.includes(role)) {
      localStorage.setItem("activeRole", role);
      setUser({ ...user, activeRole: role });

      if (role === ROLES.ADMIN) {
        navigate("/Admin/ManageLocation");
      } else if (role === ROLES.BOARDING) {
        navigate("/Petboarding/Dashboard");
      } else {
        navigate("/unauthorized");
      }
    }
  };

  const logout = useCallback(async () => {
    // 1. Clear localStorage COMPLETELY
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("roles");
    localStorage.removeItem("activeRole");
    localStorage.removeItem("is_verified");
    localStorage.removeItem("email");
    localStorage.removeItem("pet_boarding");

    // 2. Clear any application state
    setUser(null);

    // 3. *** CRITICAL: Remove the Authorization header from Axios defaults ***
    // This prevents any subsequent requests from accidentally using a cached token
    delete axiosInstance.defaults.headers.common["Authorization"];

    // 4. Navigate to home page
    navigate("/");
  }, [navigate]);

  useEffect(() => setLogoutCallback(logout), [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        registerUser,
        setActiveRole,
        isInitialized,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
