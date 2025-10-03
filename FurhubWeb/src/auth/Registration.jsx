import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LottieSpinner } from "../components/LottieSpinner";
import { registerAuth } from "../api/authAPI";
import {
  validateRegistrationToken,
  resendLinkAPI,
} from "../api/preRegistrationAPI";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { InputName } from "../components/Inputs/InputName";
import { InputPhone } from "../components/Inputs/InputPhone";
import { InputEmail } from "../components/Inputs/InputEmail";
import { InputPassword } from "../components/Inputs/InputPassword";
import { Button } from "../components/Buttons/Button";
import { parseError } from "@/utils/parseError";
import { toast } from "sonner";

const validationSchema = yup.object().shape({
  first_name: yup.string().required("field required"),
  last_name: yup.string().required("field required"),
  phone_no: yup
    .string()
    .required("field required")
    .matches(/^09[0-9]{9}$/, "Phone number must start with 09 and be 11 digit"),
  email: yup.string().email().notRequired(),
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
  confirm_password: yup
    .string()
    .required("fill this field")
    .oneOf([yup.ref("password")], "Password does not match"),
});

export const Registration = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [applicationInfo, setApplicationInfo] = useState(null);
  const [tokenError, setTokenError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError("No registration token provided");
        setValidating(false);
        return;
      }

      try {
        setValidating(true);
        const result = await validateRegistrationToken(token);

        if (result?.valid && result.application) {
          setApplicationInfo(result.application);

          // Pre-fill form with application data
          // setValue("first_name", result.application.first_name || "");
          // setValue("last_name", result.application.last_name || "");
          setValue("email", result.application.email || "");

          setTokenError(null);
        } else if (result?.expired && result.application) {
          // Allow resend link flow even if token expired
          setApplicationInfo(result.application);
          setValue("email", result.application.email || "");
          setTokenError(
            "Registration link has expired. You can request a new link."
          );
        } else {
          setTokenError(result.error || "Invalid registration link");
        }
      } catch (error) {
        setTokenError("Failed to validate registration token");
        setApplicationInfo(error.application);
        console.error("Token validation error:", error);
      } finally {
        setValidating(false);
      }
    };
    validateToken();
  }, [token, setValue]);

  const registrationForm = async (data) => {
    const {
      first_name,
      last_name,
      phone_no,
      email,
      password,
      confirm_password,
    } = data;

    // Verify that the email matches the application
    if (applicationInfo && applicationInfo.email !== email) {
      toast.error("Email must match the application email");
      return;
    }

    setLoading(true);
    try {
      const result = await registerAuth(
        first_name,
        last_name,
        phone_no,
        email,
        password,
        confirm_password,
        token // Include the registration token
      );

      const tokenData = result.access;
      const refreshToken = result.refresh;
      const roles = result.roles || [];
      const is_verified = result.is_verified === true;

      registerUser(
        tokenData,
        refreshToken,
        roles,
        is_verified,
        result.email || email
      );
      toast.success(
        "Registration completed! Please check your email for verification."
      );
      //not sure if i navigate
      // navigate("/verify");
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const resendLink = async () => {
    setLoading(true);
    if (!applicationInfo?.application_id || !applicationInfo?.email) {
      toast.error("Invalid registration link");
      return;
    }
    try {
      const payload = {
        email: applicationInfo?.email,
        application_id: applicationInfo?.application_id,
      };
      const response = await resendLinkAPI(payload);
      toast.success(response.message);
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  // Show loading while validating token
  if (validating) {
    return (
      <Layout>
        <div className="max-w-2xl flex flex-col items-center justify-center p-7 border-1 rounded-2xl bg-white/90 shadow">
          <div className="flex flex-col items-center justify-center py-12">
            <LottieSpinner size={80} />
            <p className="text-xl font-semibold mt-4">
              Validating registration link...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error if token is invalid
  if (tokenError) {
    return (
      <Layout>
        <div className="max-w-2xl flex flex-col items-center justify-center p-7 border-1 rounded-2xl bg-white/90 shadow">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-semibold text-red-600 mb-2">
              Invalid Registration Link
            </h1>
            <p className="text-gray-600 mb-6">{tokenError}</p>
            {/* Loading screen */}
            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
                <LottieSpinner size={120} />
                <p className="text-xl font-Fugaz">Creating your account...</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                type="button"
                onClick={resendLink}
                className="w-full underline cursor-pointer text-lg hover:text-blue-700">
                Click here to send link to your email.
              </button>
              <Link to="/" className="block text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl flex flex-col items-center justify-center p-7 border-1 rounded-2xl bg-white/90 shadow">
        <div className="flex w-full h-fit justify-start items-start">
          <h1 className="text-[2rem] font-open-sans font-semibold">
            Complete Your Provider Registration
          </h1>
        </div>

        {/* Loading screen */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
            <LottieSpinner size={120} />
            <p className="text-xl font-Fugaz">Creating your account...</p>
          </div>
        )}

        <div className="flex-1 w-full h-full">
          {/* Registration form */}
          <form onSubmit={handleSubmit(registrationForm)}>
            {/* Account details header */}
            <h2 className="text-2xl mb-1 font-semibold">Account Details</h2>
            <div className="border-t-1 py-2">
              {/* name of user container */}
              <div className="mb-2 flex lg:flex-row w-full space-x-4">
                {/* firstname input*/}
                <div className="flex-1 flex-col">
                  <label htmlFor="first_name" className="block text-black mb-2">
                    First Name
                  </label>
                  <InputName
                    id="first_name"
                    name="first_name"
                    placeholder="Enter your First name"
                    register={register}
                    errors={errors.first_name}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                {/* lastname input*/}
                <div className="flex-1 flex-col">
                  <label htmlFor="last_name" className="block text-black mb-2">
                    Last Name
                  </label>
                  <InputName
                    id="last_name"
                    name="last_name"
                    placeholder="Enter your Lastname"
                    register={register}
                    errors={errors.last_name}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* phone and email container */}
              <div className="mb-2 flex lg:flex-row w-full space-x-4">
                {/* phone number input*/}
                <div className="flex-1 flex-col">
                  <label htmlFor="phone_no" className="block text-black mb-2">
                    Phone Number
                  </label>
                  <InputPhone
                    id="phone_no"
                    name="phone_no"
                    placeholder="09"
                    register={register}
                    errors={errors.phone_no}
                  />
                  {errors.phone_no && (
                    <p className="text-red-500 text-sm">
                      {errors.phone_no.message}
                    </p>
                  )}
                </div>

                {/* email input */}
                <div className="flex-1 flex-col">
                  <label htmlFor="email" className="block text-black mb-2">
                    Email
                  </label>
                  <InputEmail
                    id="email"
                    name="email"
                    placeholder="sample@mail.com"
                    register={register}
                    readOnly={!!applicationInfo?.email}
                  />
                </div>
              </div>

              {/* Password container */}
              <div className="mb-2 flex lg:flex-row w-full space-x-4">
                {/* password input*/}
                <div className="flex-1 flex-col">
                  <label htmlFor="password" className="block text-black mb-2">
                    Password
                  </label>
                  <InputPassword
                    id="password"
                    name="password"
                    placeholder="password"
                    register={register}
                    errors={errors.password}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* confirm password input*/}
                <div className="flex-1 flex-col">
                  <label
                    htmlFor="confirm_password"
                    className="block text-black mb-2">
                    Confirm Password
                  </label>
                  <InputPassword
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Confirm password"
                    register={register}
                    errors={errors.confirm_password}
                  />
                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button label="Sign up" />
          </form>
        </div>
        <div className="flex flex-row justify-center mt-5 gap-1">
          <p>Already have an account?</p>
          <Link to="/">
            <h2 className="font-semibold text-blue-500 underline hover:text-blue-900">
              Login
            </h2>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
