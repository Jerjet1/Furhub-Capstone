import axios from "axios";
// import axiosInstance from "./axiosInterceptor";
import { API_ENDPOINTS } from "./apiEndpoints";
export const forgotPasswordAPI = async (email) => {
  try {
    const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, email);

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const verifyCodeAPI = async (email, code) => {
  try {
    const response = await axios.post(API_ENDPOINTS.VERIFY_CODE, {
      email,
      code,
    });

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
    const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
      email,
      new_password,
      confirm_password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
