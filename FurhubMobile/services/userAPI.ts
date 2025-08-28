import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { USER_ENDPOINTS } from "./endpoints";
import { axiosInstance } from "./axiosInterceptor";

export interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  address?: string;
}

export interface PetOwnerDetails {
  emergency: string;
  bio: string;
}

export const userDetailsAPI = async (): Promise<UserDetails> => {
  try {
    // const token = await SecureStore.getItemAsync("token");
    const response = await axiosInstance.get(USER_ENDPOINTS.USER_DETAILS);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const petOwnerAPI = async (): Promise<PetOwnerDetails> => {
  try {
    const response = await axiosInstance.get(USER_ENDPOINTS.PET_OWNER_DETAILS);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
