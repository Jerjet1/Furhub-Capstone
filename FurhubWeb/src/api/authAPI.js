import axios from "axios";
import { API_URL } from "../config/config";
import { API_ENDPOINTS } from "./apiEndpoints";
import axiosInstance from "./axiosInterceptor";
//bogo mani ip address
const loginURL = new URL("users/login/", API_URL).toString();
const registerURL = new URL("users/register/", API_URL).toString();
const boardingRequirementsURL = new URL(
  "users/image_upload/",
  API_URL
).toString();
const checkEmailURL = new URL("users/check-email", API_URL).toString();
const resendCodeURL = new URL("users/resend-code/", API_URL).toString();
const verifyEmailURL = new URL("users/verify/", API_URL).toString();

export const loginAuth = async (email, password) => {
  try {
    // const response = await axios.post(loginURL, { email, password });
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    // if (response.data.refresh && response.data.access) {
    //   localStorage.setItem("token", response.data.access);
    //   localStorage.setItem("refresh", response.data.refresh);
    //   if (response.data.role) {
    //     localStorage.setItem("roles", JSON.stringify(response.data.role));
    //   }
    // }
    // console.log("is_verified: ", response.data.is_verified);
    // console.log("pet_boarding: ", response.data.pet_boarding);
    // console.log("email:", response.data.email);
    // console.log("pet_walker:", response.data.pet_walker);
    // console.log("role:", response.data.roles);

    // console.log(localStorage.getItem("token"));
    // console.log(localStorage.getItem("refresh"));

    return response.data;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const registerAuth = async (
  first_name,
  last_name,
  phone_no,
  email,
  password,
  confirm_password,
  role
) => {
  try {
    // const response = await axios.post(registerURL, {
    //   first_name,
    //   last_name,
    //   phone_no,
    //   email,
    //   password,
    //   confirm_password,
    //   role,
    // });

    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, {
      first_name,
      last_name,
      phone_no,
      email,
      password,
      confirm_password,
      role,
    });

    // if (response.data.refresh && response.data.access) {
    //   localStorage.setItem("token", response.data.access);
    //   localStorage.setItem("refresh", response.data.refresh);
    // }
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const requirementsUpload = async (formData) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.REQUIREMENTS_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyEmail = async (payload) => {
  try {
    // const response = await axios.post(verifyEmailURL, payload);

    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_EMAIL,
      payload
    );

    // if (response.data.refresh && response.data.access) {
    //   localStorage.setItem("token", response.data.access);
    //   localStorage.setItem("refresh", response.data.refresh);
    // }
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await axios.post(API_ENDPOINTS.RESEND_CODE, email);

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const checkEmailAvailable = async (email) => {
  try {
    await axios.get(API_ENDPOINTS.CHECK_MAIL, { params: { email: email } });

    return false;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data?.exist) {
      // If 400 and response is "exist: true", then email is in use
      return true;
    }
    throw error.response?.data || { details: "Something went wrong" };
  }
};
