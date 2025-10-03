import axios from "axios";
import axiosInstance from "./axiosInterceptor";
import { API_ENDPOINTS } from "./apiEndpoints";

export const fetchUsers = async (page) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.USERS}?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const userDetailsAPI = {
  getDetails: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER_DETAILS);
      return response.data;
    } catch (error) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
  updateUser: async (data) => {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.USER_DETAILS,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
};
