import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiArrowLeft } from "react-icons/fi";
import { InputEmail } from "../components/Inputs/InputEmail";
import { Layout } from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { InputOTP } from "../components/Inputs/InputOTP";
import {
  resetPasswordAPI,
  forgotPasswordAPI,
  verifyCodeAPI,
} from "../api/forgotPasswordAPI";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputPassword } from "../components/Inputs/InputPassword";
import { Button } from "../components/Buttons/Button";
import { resendCode } from "../utils/resendCode";
import { useForgotPassword } from "../context/ForgotPasswordProvider";
import { useAuth } from "../context/useAuth";
import { ResendButtom } from "../components/Buttons/ResendButtom";
import { ImageLayout } from "../components/Layout/ImageLayout";
import { LottieSpinner } from "../components/LottieSpinner";
import { Toast } from "../components/Toast";
import { toast } from "sonner";
import { parseError } from "@/utils/parseError";

// page 1
export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  // const [message, setMessage] = useState("");
  const { set_email } = useForgotPassword();
  const navigate = useNavigate();

  const validateEmail = yup.object().shape({
    email: yup.string().email("invalid email").required("Email is required"),
  });

  useEffect(() => {
    if (user) {
      navigate(-1);
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validateEmail) });

  const emailForm = async (data) => {
    setLoading(true);
    try {
      const { email } = data;
      const result = await forgotPasswordAPI({ email });
      set_email(email);
      console.log("message: ", result);
      navigate("/verify-code", { replace: true });
    } catch (error) {
      // console.log("error", error);
      // let message = "Submit failed. Please try again.";

      // if (typeof error === "string") {
      //   message = error;
      // } else if (typeof error.details === "string") {
      //   message = error.details;
      // } else if (typeof error.detail === "string") {
      //   message = error.detail;
      // } else if (typeof error.message === "string") {
      //   message = error.message;
      // } else if (Array.isArray(error)) {
      //   message = error.join("\n");
      // } else if (typeof error === "object") {
      //   message = Object.values(error).flat().join("\n");
      // }
      // setMessage(message);
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* display message */}
      {/* <Toast error={message} setError={setMessage} /> */}

      {/* Loading screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      )}

      <div className="w-[30rem] h-full flex flex-col items-start justify-start py-5 px-5">
        <div className="flex-1 w-full h-full space-y-4">
          <button
            onClick={() => {
              navigate("/", { replace: true });
            }}
            className="flex flex-row hover:bg-gray-200/55 pr-2 rounded-sm cursor-pointer">
            <FiChevronLeft size={25} />
            Back to Login
          </button>
          <h1 className="text-[25px] font-open-sans">Forgot your password?</h1>
          <p>Enter your email to send verification code.</p>
          <form className=" space-y-3" onSubmit={handleSubmit(emailForm)}>
            <label htmlFor="email" className="block text-black mb-2">
              Email
            </label>
            <InputEmail
              id="email"
              name="email"
              placeholder="Enter your email"
              register={register}
              errors={errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <Button label="Submit" />
          </form>
        </div>
      </div>
      <ImageLayout src="/src/assets/catdog.jpg" />
    </Layout>
  );
};

// Page 2
export const VerifyCode = () => {
  const { email } = useForgotPassword();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  // const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!email || user) {
      navigate(-1);
    }
  }, [email, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!code || code.length !== 6) {
      setError("enter 6 digit verification code");
      return;
    }
    try {
      console.log(email);
      console.log(code);
      const result = await verifyCodeAPI(email, code);
      console.log("message: ", result);

      navigate("/reset-password", { replace: true });
    } catch (error) {
      // console.log("error", error);
      // let message = "Submit failed. Please try again.";

      // if (typeof error === "string") {
      //   message = error;
      // } else if (typeof error.details === "string") {
      //   message = error.details;
      // } else if (typeof error.detail === "string") {
      //   message = error.detail;
      // } else if (typeof error.message === "string") {
      //   message = error.message;
      // } else if (Array.isArray(error)) {
      //   message = error.join("\n");
      // } else if (typeof error === "object") {
      //   message = Object.values(error).flat().join("\n");
      // }
      // setMessage(message);
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (valid_code) => {
    setCode(valid_code);
  };

  return (
    <Layout>
      {/* display message */}
      {/* <Toast error={message} setError={setMessage} /> */}

      {/* Loading screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      )}

      <div className="w-[30rem] h-full flex flex-col items-start justify-start py-5 px-5">
        <div className="flex-1 w-full h-full space-y-4">
          <button
            onClick={() => {
              navigate("/forgot-password", { replace: true });
            }}
            className="flex flex-row hover:bg-gray-200/55 pr-2 rounded-sm cursor-pointer">
            <FiArrowLeft size={25} />
          </button>
          <h1 className="text-[25px] font-open-sans">Verify Code</h1>
          <p>Verification Code has been sent to your email.</p>
          <form className=" space-y-4" onSubmit={handleSubmit}>
            <InputOTP onComplete={handleChange} errors={error} />
            <div className="flex justify-start items-center space-x-1">
              <p>Didn't receive a code?</p>
              <ResendButtom onResend={() => resendCode(email)} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button label="Submit" />
          </form>
        </div>
      </div>
      <ImageLayout src="/src/assets/catdog.jpg" />
    </Layout>
  );
};

// page 3
export const ResetPassword = () => {
  const { email, remove_Email } = useForgotPassword();
  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const validatePassword = yup.object().shape({
    password: yup
      .string()
      .required("fill this field")
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must not exceed 16 characters")
      .matches(/[A-Z]/, "Password must have atleast one uppercase letter")
      .matches(/[a-z]/, "Password must have atleast one lowercase letter")
      .matches(/[0-9]/, "Password must have atleast one number")
      .matches(
        /[!@#$%^&*]/,
        "password must have atleast one special character (!@#$%^&*)"
      ),
    confirmPassword: yup
      .string()
      .required("fill this field")
      .oneOf([yup.ref("password")], "Password does not match"),
  });

  useEffect(() => {
    if (!email || user) {
      navigate(-1);
    }
  }, [email, user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validatePassword) });

  const passwordForm = async (data) => {
    setLoading(true);
    try {
      const { password, confirmPassword } = data;
      const result = await resetPasswordAPI(email, password, confirmPassword);
      remove_Email();
      navigate("/");
      console.log({ email: email, "message: ": result });
    } catch (error) {
      // console.log("error", error);
      // let message = "Submit failed. Please try again.";

      // if (typeof error === "string") {
      //   message = error;
      // } else if (typeof error.details === "string") {
      //   message = error.details;
      // } else if (typeof error.detail === "string") {
      //   message = error.detail;
      // } else if (typeof error.message === "string") {
      //   message = error.message;
      // } else if (Array.isArray(error)) {
      //   message = error.join("\n");
      // } else if (typeof error === "object") {
      //   message = Object.values(error).flat().join("\n");
      // }
      // setMessage(message);
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* display message */}
      {/* <Toast error={message} setError={setMessage} /> */}

      {/* Loading screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
          <LottieSpinner size={120} />
          <p className="text-xl font-Fugaz">Loading...</p>
        </div>
      )}
      <div className="w-[30rem] h-full flex flex-col items-start justify-start py-5 px-5">
        <div className="flex-1 w-full h-full space-y-4">
          <h1 className="text-[25px] font-open-sans">Set a Password</h1>
          <p className="text-neutral-600">
            Enter your new password and dont forget again hehe.
          </p>
          <form className=" space-y-4" onSubmit={handleSubmit(passwordForm)}>
            <div className="mb-2">
              <label htmlFor="password" className="block text-black mb-2">
                Create new password
              </label>
              <InputPassword
                id="password"
                name="password"
                placeholder="Enter your password"
                register={register}
                errors={errors.password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mb-2">
              <label
                htmlFor="confirmPassword"
                className="block text-black mb-2">
                Re-enter new password
              </label>
              <InputPassword
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                register={register}
                errors={errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button label="Submit" />
          </form>
        </div>
      </div>
      <ImageLayout src="/src/assets/catdog.jpg" />
    </Layout>
  );
};
