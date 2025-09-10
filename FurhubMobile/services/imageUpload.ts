import axios from "axios";
import { axiosInstance } from "./axiosInterceptor";
import * as SecureStore from "expo-secure-store";
import { API_ENDPOINTS } from "./endpoints";

// Upload profile Pictures
export const uploadImageAPI = async (FormData: any) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await axiosInstance.post(
      API_ENDPOINTS.PROFILE_PICTURE,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

// fetch profilePicture
export const fetchProfileAPI = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE_PICTURE);
    return response.data.image;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

// Upload service provider requirements
export const requirementsUpload = async (FormData: any) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.REQUIREMENTS_UPLOAD,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
