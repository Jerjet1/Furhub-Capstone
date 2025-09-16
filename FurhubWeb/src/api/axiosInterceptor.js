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

let isRefresh = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

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

      if (isRefresh) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (token && originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefresh = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // new token in localStorage
        localStorage.setItem("token", newAccessToken);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Update the Authorization header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Token refresh failed:", refreshError);
        if (logoutFunction) {
          logoutFunction();
        }
        // return Promise.reject(refreshError);
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      } finally {
        isRefresh = false;
      }
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Always skip ngrok warning page
    config.headers["ngrok-skip-browser-warning"] = "true";
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
