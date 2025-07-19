import React, { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
export const PendingProvider = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
  }, [user]);

  return (
    <div className="flex justify-center items-center">
      Admin will verify your application please wait....
    </div>
  );
};
