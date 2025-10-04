import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { InputOTP } from "../components/Inputs/InputOTP";
import { FiChevronLeft } from "react-icons/fi";
import { Layout } from "../components/Layout/Layout";
import { verifyEmail } from "../api/authAPI";
import { ResendButtom } from "../components/Buttons/ResendButtom";
import { resendCode } from "../utils/resendCode";
import { LottieSpinner } from "../components/LottieSpinner";
import { toast } from "sonner";
import { parseError } from "@/utils/parseError";

export const VerificationPage = () => {
  const [otp, setOTP] = useState("");
  const { user, logout, registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const payload = {
        email: user.email,
        code: otp,
      };

      const result = await verifyEmail(payload);
      const token = result.access;
      const refreshToken = result.refresh;
      const roles = result.roles || [];
      const is_verified = result.is_verified === true;
      registerUser(
        token,
        refreshToken,
        roles,
        is_verified,
        result.email || email
      );
      if (roles.includes("Boarding")) {
        navigate("/Petboarding/Bookings", { replace: true });
      } else {
        navigate("/unauthorized", { replace: true });
      }
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    logout();
  };

  return (
    <Layout>
      {/* Loading screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      )}

      {/* form container */}
      <div className="max-w-2xl h-full flex flex-col items-start justify-start p-10 border-1 rounded-2xl bg-white/90 shadow">
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
    </Layout>
  );
};
