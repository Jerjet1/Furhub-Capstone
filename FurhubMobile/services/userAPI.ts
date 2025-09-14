import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_ENDPOINTS } from "./endpoints";
import { axiosInstance } from "./axiosInterceptor";

export interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  address?: string;

    // Add these location fields
  city?: string;
  barangay?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
}

export interface PetOwnerDetails {
  emergency_no: string;
  bio: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  barangay?: string;
  street?: string;
}

export const userDetailsAPI = {
  getDetails: async (): Promise<UserDetails> => {
    try {
      // const token = await SecureStore.getItemAsync("token");
      const response = await axiosInstance.get(API_ENDPOINTS.USER_DETAILS);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
  updateUser: async (data: Partial<UserDetails>): Promise<UserDetails> => {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.USER_DETAILS,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
};

export const petOwnerAPI = {
  getPetOwner: async (): Promise<PetOwnerDetails> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PET_OWNER_DETAILS);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
  updatePetOwner: async (
    data: Partial<PetOwnerDetails>
  ): Promise<PetOwnerDetails> => {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.PET_OWNER_DETAILS,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
};

// Use your axiosInstance (which already has baseURL & headers)
export const locationAPI = {
  getLatestLocation: async () => {
    try {
      const response = await axiosInstance.get("/locations/latest/");
      console.log("Latest location response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("Location API error:", error.response || error.message || error);
      throw error.response?.data || { details: "Failed to fetch latest location" };
    }

  },

  createLocation: async (payload: any) => {
    try {
      const response = await axiosInstance.post("/locations/", payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { details: "Failed to create location" };
    }
  },
};
