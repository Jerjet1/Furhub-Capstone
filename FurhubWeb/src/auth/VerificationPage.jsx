import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { InputOTP } from "../components/Inputs/InputOTP";
import { FiChevronLeft } from "react-icons/fi";
import { Layout } from "../components/Layout/Layout";
import { verifyEmail } from "../api/authAPI";
import { ROLES } from "../App";
import { ResendButtom } from "../components/Buttons/ResendButtom";
import { resendCode } from "../utils/resendCode";

export const VerificationPage = () => {
  const [otp, setOTP] = useState("");
  const { user, logout, registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email || user?.email || localStorage.getItem("email");

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

  return (
    <Layout>
      <div className="w-[25rem] h-full flex flex-col items-start justify-start py-5">
        <div className="flex-1 w-full h-full space-y-4">
          <button
            onClick={handleBack}
            className="flex flex-row hover:bg-gray-200/55 pr-2 rounded-sm cursor-pointer">
            <FiChevronLeft size={25} />
            Back to Login
          </button>
          <h1 className="text-[20px] font-open-sans font-semibold">
            Verify your Account
          </h1>
          <p>Verification code has sent to your email: {email}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <InputOTP onComplete={handleOTPChange} />
            <div className="flex justify-start items-center space-x-1">
              <p>Didn't receive a code?</p>
              <ResendButtom onResend={() => resendCode(email)} />
            </div>
            <button
              className="w-full h-10 bg-indigo-500 hover:bg-indigo-900 text-xl font-semibold rounded-sm text-white cursor-pointer"
              type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <img
          src="/src/assets/catdog.jpg"
          className="object-fill h-[90%] rounded-md"
        />
      </div>
    </Layout>
  );
};
