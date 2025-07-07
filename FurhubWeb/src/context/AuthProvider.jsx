import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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

          setUser({
            token,
            roles: parsedRole,
            activeRole: roleToSet,
          });
          // Wait for state to update before navigating
          await new Promise((resolve) => setTimeout(resolve, 0));
          if (
            window.location.pathname === "/" ||
            window.location.pathname === "/register"
          ) {
            if (parsedRole.includes(ROLES.ADMIN)) {
              navigate("/Admin/Dashboard");
            } else if (parsedRole.includes(ROLES.BOARDING)) {
              navigate("/Petboarding/Dashboard");
            } else {
              navigate("/unauthorize");
            }
          }
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

  const login = (token, roles) => {
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("activeRole", roles[0]);

    setUser({ token, roles, activeRole: roles[0] });

    if (roles.includes(ROLES.ADMIN)) {
      navigate("/Admin/Dashboard");
    } else if (roles.includes(ROLES.BOARDING)) {
      navigate("/Petboarding/Dashboard");
    } else {
      navigate("/unauthorize");
    }
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
