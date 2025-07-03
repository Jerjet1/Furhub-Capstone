import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LottieSpinner } from "../components/LottieSpinner";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { loginAuth } from "../api/api";
import { useAuth } from "../context/AuthProvider";

const validationSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("Email is required"),
  password: yup.string().required("password is required"),
});
export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: setUser } = useAuth();
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const loginForm = async (data) => {
    const { email, password } = data;
    console.log("Login with:", { email, password });
    setLoading(true);
    try {
      const result = await loginAuth(email, password);
      const token = result.access;
      const roles = result.roles || [];
      setUser(token, roles);

      if (roles.includes("Boarding")) {
        navigate("/Petboarding/Dashboard");
      } else if (roles.includes("Admin")) {
        navigate("/Admin/Dashboard");
      } else {
        navigate("/unauthorize");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-[25rem] h-[29rem] flex flex-col items-center justify-center bg-white/20 p-10 rounded-2xl shadow-xl/30">
        <div className="flex flex-col w-full h-fit justify-normal items-center mb-[30px]">
          <h1 className="text-[50px] font-open-sans">Login</h1>
          <p className="text-[20px] font-open-sans">Welcome to Furhub</p>
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
            <div
              className={`flex items-center border ${
                errors.email ? "border-red-500" : "border-black"
              } rounded px-3 py-2 focus-within:ring-1`}>
              <FiMail className="to-black mr-2" />
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter your email"
                className={`w-full outline-none bg-transparent`}
                autoCapitalize="none"
                autoComplete="off"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label htmlFor="password" className="block text-black mb-2">
              Password
            </label>
            <div
              className={`flex items-center border ${
                errors.password ? "border-red-500" : "border-black"
              } rounded px-3 py-2 focus-within:ring-1`}>
              <FiLock className="to-black mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                {...register("password")}
                className="w-full outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none text-black"
                tabIndex={-1} // prevent tabbing into the icon button
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Link className="hover:text-blue-950 underline" tabIndex={-1}>
              <p className="mt-2">Forgot password?</p>
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 mt-2 text-lg">
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};
