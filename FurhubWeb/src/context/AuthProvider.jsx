import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout as LogoutAPI } from "../api/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem("token");
      const roles = localStorage.getItem("role");
      const activeRole = localStorage.getItem("activeRole");

      if (token && roles) {
        const parsedRole = JSON.parse(roles);
        const roleToSet = activeRole || parsedRole[0];

        setUser({
          token,
          roles: parsedRole,
          activeRole: roleToSet,
        });

        if (parsedRole.includes("Boarding")) {
          navigate("/Petboarding/Dashboard");
        } else if (parsedRole.includes("Admin")) {
          navigate("/Admin/Dashboard");
        } else {
          navigate("/unauthorize");
        }
      }
      setIsInitialized(true);
    };
    loadUserFromStorage();
  }, [navigate]);

  const login = (token, roles) => {
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("activeRole", roles[0]);

    setUser({ token, roles, activeRole: roles[0] });

    if (roles.includes("boarding")) {
      navigate("/Petboarding/Dashboard");
    } else if (roles.includes("admin")) {
      navigate("/Admin/Dashboard");
    } else {
      navigate("/unauthorize");
    }
  };

  const setActiveRole = (role) => {
    if (user && user.roles.includes(role)) {
      localStorage.setItem("activeRole", role);
      setUser({ ...user, activeRole: role });

      if (role === "Boarding") {
        navigate("/Petboarding/Dashboard");
      } else if (role === "Admin") {
        navigate("/Admin/Dashboard");
      } else {
        navigate("/unauthorized");
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("activeRole");
    await LogoutAPI();
    setUser(null);
    navigate("/");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setActiveRole,
        isInitialized,
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
