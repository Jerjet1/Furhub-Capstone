import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { Layout } from "../components/Layout/Layout";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LottieSpinner } from "../components/LottieSpinner";
import { ModalService } from "../components/Modals/ModalService";
import {
  registerAuth,
  requirementsUpload,
  checkEmailAvailable,
} from "../api/authAPI";
import { Link } from "react-router-dom";
import { ROLES } from "../App";
import { useAuth } from "../context/AuthProvider";
import { ImageLayout } from "../components/Layout/ImageLayout";
import { InputName } from "../components/Inputs/InputName";
import { InputPhone } from "../components/Inputs/InputPhone";
import { InputEmail } from "../components/Inputs/InputEmail";
import { InputPassword } from "../components/Inputs/InputPassword";
import { Toast } from "../components/Toast";

const validationSchema = yup.object().shape({
  first_name: yup.string().required("field required"),
  last_name: yup.string().required("field required"),
  phone_no: yup
    .string()
    .required("field required")
    .matches(/^09[0-9]{9}$/, "Phone number must start with 09 and be 11 digit"),
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
  const [emailError, setEmailError] = useState("");
  const [barangayClearance, setBarangayClearance] = useState(null);
  const [validID, setValidID] = useState(null);
  const [selfieWithID, setSelfieWithID] = useState(null);
  const [submissionAttempt, setSubmissionAttempt] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [offeredServices, setOfferedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { registerUser } = useAuth();

  const debounceCheckEmail = useCallback(
    debounce(async (emailToCheck) => {
      try {
        const isTaken = await checkEmailAvailable(emailToCheck);
        if (isTaken) {
          setEmailError("Email is already in use");
        } else {
          setEmailError("");
        }
      } catch (error) {
        console.log("unexpected Error occured");
      }
    }, 1000),
    []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const email = control
    ? useWatch({
        control,
        name: "email",
      })
    : "";

  useEffect(() => {
    if (email) {
      debounceCheckEmail(email);
    } else {
      setEmailError("");
    }
  }, [email, debounceCheckEmail]);

  const registrationForm = async (data) => {
    const formData = new FormData();
    setSubmissionAttempt(true);
    if (!barangayClearance || !validID || !selfieWithID) {
      return;
    }

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
        confirm_password,
        ROLES.BOARDING
      );

      const user_id = result.id;
      const token = result.access;
      const refreshToken = result.refresh;
      const roles = result.roles || [];
      const is_verified = result.is_verified === true;
      const pet_boarding_status = result.pet_boarding;

      registerUser(
        token,
        refreshToken,
        roles,
        is_verified,
        result.email || email,
        pet_boarding_status
      );

      const barangayFormData = formData;
      barangayFormData.append("user", user_id);
      barangayFormData.append("category", "boarding_requirement");
      barangayFormData.append("label", "barangay_clearance");
      barangayFormData.append("image", barangayClearance);
      await requirementsUpload(barangayFormData);

      const validIDFormData = formData;
      barangayFormData.append("user", user_id);
      barangayFormData.append("category", "boarding_requirement");
      barangayFormData.append("label", "valid_id");
      barangayFormData.append("image", validID);
      await requirementsUpload(validIDFormData);

      const selfieFormData = formData;
      barangayFormData.append("user", user_id);
      barangayFormData.append("category", "boarding_requirement");
      barangayFormData.append("label", "selfie_with_id");
      barangayFormData.append("image", selfieWithID);
      await requirementsUpload(selfieFormData);
    } catch (error) {
      console.log("error", error);
      let message = "Login failed. Please try again.";

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
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = (service) => {
    setOfferedServices([...offeredServices, service]);
  };

  return (
    <Layout>
      <div className="w-[30rem] h-full flex flex-col items-center justify-center py-5">
        <div className="flex w-full h-fit justify-start items-start">
          <h1 className="text-[2rem] font-open-sans font-semibold">
            Register as Pet Boarding
          </h1>
        </div>

        {showServiceModal && (
          <ModalService
            onClose={() => {
              setShowServiceModal(false);
            }}
            onAddService={handleAddService}
          />
        )}

        {/* display message */}
        <Toast error={message} setError={setMessage} />

        {/* Loading screen */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 flex-col">
            <LottieSpinner size={120} />
            <p className="text-xl font-Fugaz">Loading...</p>
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
                    errors={errors.email}
                  />
                  {(errors.email || emailError) && (
                    <p className="text-red-500 text-sm">
                      {errors.email?.message || emailError}
                    </p>
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
            {/* Service Offered
            <div className="border-t-1 border-b-1 py-2">
              <h2 className="text-2xl mb-2 font-semibold">Service Offer</h2>
              <button
                type="button"
                onClick={() => setShowServiceModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                Add Service
              </button>
              <div className="w-full h-40 border mt-2 rounded-sm px-5">
                {offeredServices.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold">Services Added:</h3>
                    <ul className="list-disc ml-5">
                      {offeredServices.map((s, i) => (
                        <li key={i}>
                          {s.service} - PHP {s.rate} ({s.rate_type})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div> */}
            {/* Requirements Upload container*/}
            <div className="border-b-1 py-2">
              <h2 className="text-2xl mb-2 font-semibold">
                Requirements Upload
              </h2>
              <div className="flex flex-wrap w-full justify-between gap-2">
                {/* barangay clearance */}
                <div className="flex flex-col w-52">
                  <label
                    htmlFor="barangayClearance"
                    className="block text-black mb-2 text-lg">
                    Barangay Clearance
                  </label>
                  <input
                    type="file"
                    id="barangayClearance"
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={(e) => {
                      setBarangayClearance(e.target.files[0]);
                    }}
                    className={`w-full rounded-xl border ${
                      submissionAttempt && !barangayClearance
                        ? "border-red-500"
                        : "border-black"
                    } bg-indigo-300 p-1 hover:bg-indigo-500`}
                  />
                  {submissionAttempt && !barangayClearance && (
                    <p className="text-red-500 text-sm">
                      Please upload Barangay Clearance
                    </p>
                  )}
                </div>

                {/* Valid ID */}
                <div className="flex flex-col w-52">
                  <label
                    htmlFor="validID"
                    className="block text-black mb-2 text-lg">
                    Valid ID
                  </label>
                  <input
                    type="file"
                    id="validID"
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={(e) => {
                      setValidID(e.target.files[0]);
                    }}
                    className={`w-full rounded-xl border ${
                      submissionAttempt && !validID
                        ? "border-red-500"
                        : "border-black"
                    } bg-indigo-300 p-1 hover:bg-indigo-500`}
                  />
                  {submissionAttempt && !validID && (
                    <p className="text-red-500 text-sm">
                      Please upload Valid ID
                    </p>
                  )}
                </div>
                {/* selfie with id */}
                <div className="flex flex-col w-52">
                  <label
                    htmlFor="selfieWithID"
                    className="block text-black mb-2 text-lg">
                    Selfie with ID
                  </label>
                  <input
                    type="file"
                    id="selfieWithID"
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={(e) => {
                      setSelfieWithID(e.target.files[0]);
                    }}
                    className={`w-full rounded-xl border ${
                      submissionAttempt && !selfieWithID
                        ? "border-red-500"
                        : "border-black"
                    } bg-indigo-300 p-1 hover:bg-indigo-500`}
                  />
                  {submissionAttempt && !selfieWithID && (
                    <p className="text-red-500 text-sm">
                      Please upload Selfie with ID
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 mt-2 text-lg">
              Sign Up
            </button>
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
      <ImageLayout src="/src/assets/catdog.jpg" />
    </Layout>
  );
};
