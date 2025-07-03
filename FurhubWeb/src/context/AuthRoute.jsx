import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

export const AuthRoute = ({ children }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div>loading....</div>;
  }

  if (user) {
    const roles = user.roles?.map((role) => role.toLowerCase()) || [];
    const activeRole = user.activeRole?.toLowerCase();

    if (roles.includes("admin") || activeRole === "admin") {
      return <Navigate to="/Admin/Dashboard" replace />;
    } else if (roles.includes("boarding") || activeRole === "boarding") {
      return <Navigate to="/Petboarding/Dashboard" replace />;
    } else {
      return <Navigate to="/unauthorize" replace />;
    }
  }
  return children;
};
