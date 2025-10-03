import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LottieSpinner } from "../components/LottieSpinner";
import { loginAuth } from "../api/authAPI";
import { useAuth } from "../context/useAuth";
import { InputEmail } from "../components/Inputs/InputEmail";
import { InputPassword } from "../components/Inputs/InputPassword";
import { Button } from "../components/Buttons/Button";
import { toast } from "sonner";
import { parseError } from "@/utils/parseError";

const validationSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("Email is required"),
  password: yup.string().required("password is required"),
});

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  // const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const loginForm = async (data) => {
    const { email, password } = data;
    // console.log("Login with:", { email, password });
    setLoading(true);
    try {
      const result = await loginAuth(email, password);
      const token = result.access;
      const refreshToken = result.refresh;
      const roles = result.roles || [];
      const is_verified = result.is_verified === true;
      const pet_boarding_status = result.pet_boarding;
      login(
        token,
        refreshToken,
        roles,
        is_verified,
        result.email || email,
        pet_boarding_status
      );
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-[30rem] flex flex-col items-center justify-center p-7 border-1 rounded-2xl bg-white/90 shadow">
        <div className="flex flex-col w-full h-fit justify-center items-center mb-[30px]">
          <h1 className="text-[50px] font-open-sans">Login</h1>
          <p className="text-[25px] font-open-sans">Welcome to Furhub</p>
        </div>

        {/* Loading screen */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
            <LottieSpinner size={120} />
            <p className="text-xl font-Fugaz">Loading...</p>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(loginForm)}
          className="flex-1 w-full h-full">
          {/* Email Input */}
          <div className="mb-2">
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
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )} */}
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label htmlFor="password" className="block text-black mb-2">
              Password
            </label>
            <InputPassword
              id="password"
              name="password"
              placeholder="Enter your password"
              register={register}
              errors={errors.password}
            />
            {/* {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )} */}
          </div>
          <div className="flex justify-end">
            <Link
              className="hover:text-blue-950 underline"
              tabIndex={-1}
              to={"/forgot-password"}>
              <p className="mt-2">Forgot password?</p>
            </Link>
          </div>
          <Button label="Login" />
        </form>
        <div className="flex flex-row justify-center mt-5 gap-1">
          <p>Dont have an account?</p>
          <Link to="/pre-registration">
            <h2 className="font-semibold text-blue-500 underline hover:text-blue-900">
              Register
            </h2>
          </Link>
        </div>
      </div>
      {/* <ImageLayout src="/src/assets/catdog.jpg" /> */}
    </Layout>
  );
};
