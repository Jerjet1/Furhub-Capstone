import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LottieSpinner } from "../components/LottieSpinner";
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
        <LottieSpinner size={120} />
        <p className="text-xl font-Fugaz">Loading...</p>
      </div>
    ); // Or a proper loading spinner
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!user.is_verified) {
    return <Navigate to="/verify" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !user.roles.some((role) => allowedRoles.includes(role))
  ) {
    // If user does not have the required role, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};
