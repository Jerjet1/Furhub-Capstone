import axios from "axios";
import { API_URL } from "../config/config";
import { API_ENDPOINTS } from "./apiEndpoints";

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Debug log the token being used
    console.log("Using refresh token:", refreshToken);

    const response = await axios.post(
      API_ENDPOINTS.REFRESH_TOKEN,
      { refresh: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Refresh token response:", response.data);

    if (!response.data.access) {
      throw new Error("No access token in response");
    }

    // Save the new access token
    const newAccessToken = response.data.access;
    localStorage.setItem("token", newAccessToken);

    // // Save new refresh token if provided (for rotation)
    if (response.data.refresh) {
      localStorage.setItem("refresh", response.data.refresh);
    }

    // localStorage.setItem("token", response.data.access);
    // localStorage.setItem("refresh", response.data.refresh);

    return newAccessToken;
    // return response.data.access;
  } catch (error) {
    console.error("Refresh failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Clear all tokens on failure
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    throw error;
  }
};
