import React, { useEffect } from "react";
// import { useAuth } from "../context/AuthProvider";
import { useAuth } from "../context/useAuth";

import { useNavigate } from "react-router-dom";
export const PendingProvider = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
  }, [user]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      Admin will verify your application please wait....
      <button
        type="button"
        onClick={() => logout()}
        className="text-blue-700 underline cursor-pointer hover:text-blue-900 text-2xl">
        Go back to login
      </button>
    </div>
  );
};
