import axios from "axios";
import { refreshToken } from "./refreshTokenAPI";
import * as SecureStore from "expo-secure-store";

export const axiosInstance = axios.create();

let logoutFunction: any = null;

//callback function for logout
export const setLogoutCallback = (callback: any) => {
  logoutFunction = callback;
};

// put only Auth endpoints
const SKIP_REFRESH_ENDPOINTS = ["users/login/", "token/refresh"];

// intercepts error response to refresh token access
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //Skip token refresh if error occured
    if (
      SKIP_REFRESH_ENDPOINTS.some((endpoints) =>
        originalRequest.url.includes(endpoints)
      )
    ) {
      return Promise.reject(error);
    }

    // intercept 401 response if token expires and sends new token and refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError);
        if (logoutFunction) {
          logoutFunction();
        }

        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to attach token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
