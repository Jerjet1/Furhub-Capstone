import axios from "axios";
// import axiosInstance from "./axiosInterceptor";
import { API_URL } from "../config/config";

const forgotPasswordURL = new URL("users/forgot-password/", API_URL).toString();
const verifyCodeURL = new URL("users/verify-code/", API_URL).toString();
const resetPasswordURL = new URL("users/reset-password/", API_URL).toString();

export const forgotPasswordAPI = async (email) => {
  try {
    const response = await axios.post(forgotPasswordURL, email);

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const verifyCodeAPI = async (email, code) => {
  try {
    const response = await axios.post(verifyCodeURL, { email, code });

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const resetPasswordAPI = async (
  email,
  new_password,
  confirm_password
) => {
  try {
    const response = await axios.post(resetPasswordURL, {
      email,
      new_password,
      confirm_password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
