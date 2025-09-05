import axios from "axios";
import { refreshAccessToken } from "./refreshTokenAPI";

const axiosInstance = axios.create();

// Store a reference to the logout function
let logoutFunction = null;

// Export a function to set the logout callback
export const setLogoutCallback = (callback) => {
  logoutFunction = callback;
};

// list of endpoints to avoid error display
const SKIP_REFRESH_ENDPOINTS = ["users/login/", "token/refresh"];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //skips the token refresh
    if (
      SKIP_REFRESH_ENDPOINTS.some((endpoints) =>
        originalRequest.url.includes(endpoints)
      )
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If error is 401 (unauthorized) and it's not a refresh request
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Update the Authorization header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        if (logoutFunction) {
          logoutFunction();
        }
        // return Promise.reject(refreshError);
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
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
