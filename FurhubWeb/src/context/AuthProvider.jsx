import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROLES } from "../App";

export const AuthContext = createContext(null);

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
    roles,
    is_verified = false,
    email = "",
    pet_boarding_status
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("is_verified", is_verified ? "true" : "false");
    localStorage.setItem("email", email);
    localStorage.setItem("pet_boarding", pet_boarding_status);

    setUser({ token, roles, is_verified, email, pet_boarding_status });
  };

  const login = (
    token,
    roles,
    is_verified = false,
    email = "",
    pet_boarding_status
  ) => {
    localStorage.setItem("token", token);
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
        navigate("/Admin/Dashboard");
      } else if (role === ROLES.BOARDING) {
        navigate("/Petboarding/Dashboard");
      } else {
        navigate("/unauthorized");
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("activeRole");
    localStorage.removeItem("is_verified");
    localStorage.removeItem("email");
    localStorage.removeItem("pet_boarding");
    setUser(null);
    navigate("/");
  };
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
