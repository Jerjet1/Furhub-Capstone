import React, { useEffect } from "react";
// import { useAuth } from "../context/AuthProvider";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
export const Unauthorize = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
  }, [user]);
  return <div>Download the mobile application .</div>;
};
