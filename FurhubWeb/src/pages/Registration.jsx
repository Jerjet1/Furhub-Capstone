import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { MdContactPhone } from "react-icons/md";
import { PiUserRectangle } from "react-icons/pi";
import { LottieSpinner } from "../components/LottieSpinner";
import { handleNumberChange } from "../utils/handler";
import { registerAuth } from "../auth/api";
const validationSchema = yup.object().shape({
  first_name: yup.string().required("field required"),
  last_name: yup.string().required("field required"),
  phone_no: yup
    .string()
    .required("field required")
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digit"),
  email: yup.string().email("invalid email").required("field required"),
  password: yup
    .string()
    .required("fill this field")
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const registrationForm = async (data) => {
    const {
      first_name,
      last_name,
      phone_no,
      email,
      password,
      confirm_password,
    } = data;
    console.log("user details:", {
      first_name,
      last_name,
      phone_no,
      email,
      password,
      confirm_password,
    });
    setLoading(true);
    try {
      const result = await registerAuth(
        first_name,
        last_name,
        phone_no,
        email,
        password,
        confirm_password
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="w-[34rem] h-[29rem] flex flex-col items-center justify-center bg-white/20 px-10 py-5 rounded-2xl shadow-xl/30">
        <div className="flex w-full h-fit justify-start items-start mb-[30px]">
          <h1 className="text-[2rem] font-open-sans font-semibold">
            Create an Account
          </h1>
        </div>

        {/* Loading screen */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
            <LottieSpinner size={120} />
            <p className="text-xl font-Fugaz">Loading...</p>
          </div>
        )}

        {/* Registration form */}
        <form
          className="flex-1 w-full h-full"
          onSubmit={handleSubmit(registrationForm)}>
          {/* name of user container */}
          <div className="mb-2 flex lg:flex-row w-full space-x-4">
            {/* firstname input*/}
            <div className="flex-1 flex-col">
              <label htmlFor="first_name" className="block text-black mb-2">
                First Name
              </label>
              <div
                className={`flex items-center border ${
                  errors.first_name ? "border-red-500" : "border-black"
                } rounded px-3 py-2 focus-within:ring-1`}>
                <PiUserRectangle className="to-black mr-2" />
                <input
                  type="first_name"
                  id="first_name"
                  {...register("first_name")}
                  placeholder="Enter your First name"
                  className="w-full outline-none bg-transparent"
                  autoCapitalize="characters"
                  autoComplete="off"
                />
              </div>
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
              <div
                className={`flex items-center border ${
                  errors.last_name ? "border-red-500" : "border-black"
                } rounded px-3 py-2 focus-within:ring-1`}>
                <PiUserRectangle className="to-black mr-2" />
                <input
                  type="last_name"
                  id="last_name"
                  {...register("last_name")}
                  placeholder="Enter your Lastname"
                  className="w-full outline-none bg-transparent"
                  autoCapitalize="characters"
                  autoComplete="off"
                />
              </div>
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
              <div
                className={`flex items-center border ${
                  errors.phone_no ? "border-red-500" : "border-black"
                } rounded px-3 py-2 focus-within:ring-1`}>
                <MdContactPhone className="to-black mr-2" />
                <input
                  type="text"
                  id="phone_no"
                  {...register("phone_no")}
                  value={value}
                  maxLength={11}
                  onChange={(e) => handleNumberChange(e, setValue)}
                  placeholder="09"
                  autoCapitalize="none"
                  autoComplete="off"
                  className="w-full outline-none bg-transparent"
                />
              </div>
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
              <div
                className={`flex items-center border ${
                  errors.email ? "border-red-500" : "border-black"
                } rounded px-3 py-2 focus-within:ring-1`}>
                <FiMail className="to-black mr-2" />
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="sample@mail.com"
                  className="w-full outline-none bg-transparent"
                  autoCapitalize="characters"
                  autoComplete="off"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password container */}
          <div className="mb-2 flex lg:flex-row w-full space-x-4">
            {/* password input*/}
            <div className="flex-1 flex-col">
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
                  {...register("password")}
                  placeholder="password"
                  className="w-full outline-none bg-transparent"
                  autoCapitalize="characters"
                  autoComplete="off"
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
              <div
                className={`flex items-center border ${
                  errors.confirm_password ? "border-red-500" : "border-black"
                } rounded px-3 py-2 focus-within:ring-1`}>
                <FiLock className="to-black mr-2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  {...register("confirm_password")}
                  placeholder="Confirm password"
                  className="w-full outline-none bg-transparent"
                  autoCapitalize="characters"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none text-black"
                  tabIndex={-1} // prevent tabbing into the icon button
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 mt-2 text-lg">
            Sign Up
          </button>
        </form>
      </div>
    </Layout>
  );
};
