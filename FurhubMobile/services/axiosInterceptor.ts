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
const SKIP_REFRESH_ENDPOINTS = ["users/login/", "token/refresh/"];

//Queue State
let isRefresh = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (value?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
      if (isRefresh) {
        // Already refreshing → queue this request
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
        const newAccessToken = await refreshToken();

        // Save the new token in SecureStore
        await SecureStore.setItemAsync("token", newAccessToken);

        // Update axios defaults

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        console.error("Token refresh failed:", refreshError);
        if (logoutFunction) {
          logoutFunction();
        }
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
