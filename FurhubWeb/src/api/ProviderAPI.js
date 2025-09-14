import axios from "axios";
import axiosInstance from "./axiosInterceptor";
import { API_ENDPOINTS } from "./apiEndpoints";

export const fetchPetWalkerUsers = async (page) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PET_WALKER_PENDING}?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const fetchPetBoardingUsers = async (page) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PET_BOARDING_PENDING}?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
