import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";
import * as SecureStore from "expo-secure-store";

export const refreshToken = async () => {
  try {
    //check if there is refresh Token in local storage
    const refreshToken = await SecureStore.getItemAsync("refresh");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Debug log the token being used
    console.log("Using refresh token:", refreshToken);

    //fetch new refresh token with access token
    const response = await axios.post(
      API_ENDPOINTS.REFRESH_TOKEN,
      {
        refresh: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // checking the response data
    console.log("Refresh token response:", response.data);

    //throw error if no access token
    if (!response.data.access) {
      throw new Error("No access token in response");
    }

    //store new access token
    const newAccessToken = response.data?.access;
    await SecureStore.setItemAsync("token", newAccessToken);

    //store new refresh token
    if (response.data.refresh) {
      await SecureStore.setItemAsync("refresh", response.data.refresh);
    }

    return newAccessToken;
  } catch (error: any) {
    //check for error message
    console.error("Refresh failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    //clear all tokens on fail
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("refresh");

    throw error;
  }
};