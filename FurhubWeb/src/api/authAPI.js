import axios from "axios";
import { API_ENDPOINTS } from "./apiEndpoints";
import axiosInstance from "./axiosInterceptor";
export const loginAuth = async (email, password) => {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });

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
  token
) => {
  try {
    const response = await axios.post(API_ENDPOINTS.REGISTER + `${token}/`, {
      first_name,
      last_name,
      phone_no,
      email,
      password,
      confirm_password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const verifyEmail = async (payload) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_EMAIL,
      payload
    );
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

export const changePasswordAPI = async ({
  old_password,
  new_password,
  confirm_password,
}) => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.CHANGE_PASSWORD, {
      old_password,
      new_password,
      confirm_password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
