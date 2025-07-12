import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { InputOTP } from "../components/Inputs/InputOTP";
import { FiChevronLeft } from "react-icons/fi";
import { Layout } from "../components/Layout/Layout";
import { verifyEmail } from "../api/authAPI";
import { ROLES } from "../App";

export const VerificationPage = () => {
  const [otp, setOTP] = useState("");
  const { user, logout, registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    if (user.is_verified) {
      return;
    }
  }, [user, navigate]);

  const handleOTPChange = (otpValue) => {
    setOTP(otpValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    try {
      const payload = {
        email: user.email,
        code: otp,
      };

      const result = await verifyEmail(payload);
      const token = result.access;
      const roles = result.roles || [];
      const is_verified = result.is_verified === true;
      const pet_boarding_status = result.pet_boarding;
      console.log("results:", result);
      registerUser(
        token,
        roles,
        is_verified,
        result.email || email,
        pet_boarding_status
      );

      if (roles.includes("Admin")) {
        navigate("/Admin/Dashboard", { replace: true });
      } else if (roles.includes("Boarding")) {
        if (pet_boarding_status === "approved") {
          navigate("/Petboarding/Dashboard", { replace: true });
        } else if (pet_boarding_status === "pending") {
          navigate("/pending_providers", { replace: true });
        } else {
          navigate("/unauthorized", { replace: true });
        }
      } else {
        navigate("/unauthorized", { replace: true });
      }
    } catch (error) {
      let message = "Verification failed";
      console.error("something went wrong:", error);
      if (typeof error === "string") {
        message = error;
      } else if (typeof error.details === "string") {
        message = error.details;
      } else if (typeof error.detail === "string") {
        message = error.detail;
      } else if (typeof error.message === "string") {
        message = error.message;
      } else if (Array.isArray(error)) {
        message = error.join("\n");
      } else if (typeof error === "object") {
        message = Object.values(error).flat().join("\n");
      }
    }
  };

  const handleBack = () => {
    logout();
  };

  const email =
    location.state?.email || user?.email || localStorage.getItem("email");
  return (
    <div className="min-h-screen min-w-screen flex flex-co">
      <main className="flex-1 flex items-center justify-start p-5 ">
        <div className="w-[25rem] h-[29rem] flex flex-col items-start justify-start bg-white/20 p-10 rounded-2xl shadow-xl/30">
          <div className="flex-1 w-full h-full">
            <button
              onClick={handleBack}
              className="flex flex-row w-fit hover:bg-gray-200/55 px-2 py-1 rounded-sm cursor-pointer">
              <FiChevronLeft size={25} />
              Back to Login
            </button>
            <h1>Verify your Account</h1>
            <p>Verification code has sent to your email: {email}</p>
            <form onSubmit={handleSubmit}>
              <InputOTP onComplete={handleOTPChange} />
              <button
                className="w-full h-10 bg-indigo-500 text-xl font-semibold rounded-sm"
                type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
