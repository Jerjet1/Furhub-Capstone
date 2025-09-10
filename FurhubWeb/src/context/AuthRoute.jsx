import React from "react";
import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

export const AuthRoute = ({ children }) => {
  const { user, isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return <div>loading....</div>;
  }

  if (user) {
    const roles = user.roles?.map((role) => role.toLowerCase()) || [];
    const activeRole = user.activeRole?.toLowerCase();

    if (!user.is_verified) {
      // console.log("redirect back....");
      // console.log("is_verified:", user.is_verified);
      // console.log("role:", user.roles);
      return <Navigate to="/verify" replace />;
    }

    if (roles.includes("admin") || activeRole === "admin") {
      return <Navigate to="/Admin/Dashboard" replace />;
    } else if (roles.includes("boarding") || activeRole === "boarding") {
      return <Navigate to="/Petboarding/Dashboard" replace />;
      // if (user.pet_boarding_status === "approved") {
      //   // console.log("approved providers");
      //   return <Navigate to="/Petboarding/Dashboard" replace />;
      // } else if (user.pet_boarding_status === "pending") {
      //   // console.log("authRoute: pending providers");
      //   // console.log("pet_boarding:", user.pet_boarding_status);
      //   return <Navigate to="/pending_providers" replace />;
      // } else {
      //   return <Navigate to="/Petboarding/Dashboard" replace />;
      // }
    } else {
      console.log("AuthRoute: unauthorized");
      console.log("pet_boarding:", user.pet_boarding_status);
      return <Navigate to="/unauthorized" replace />;
    }
  }
  return children;
};
