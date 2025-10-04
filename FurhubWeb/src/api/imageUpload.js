import { API_ENDPOINTS } from "./apiEndpoints";
import axiosInstance from "./axiosInterceptor";
import axios from "axios";

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

export const uploadImageAPI = async (formData) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PROFILE_PICTURE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const fetchProfileAPI = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE_PICTURE);
    return response.data.image_url;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
