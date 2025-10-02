import axiosInstance from "./axiosInterceptor"; // import your axios instance
import { API_ENDPOINTS } from "./apiEndpoints";

// Provinces
export const fetchProvinces = () => axiosInstance.get(API_ENDPOINTS.PROVINCES);
export const createProvince = (data) => axiosInstance.post(API_ENDPOINTS.PROVINCES, data);

// Cities
export const fetchCities = () => axiosInstance.get(API_ENDPOINTS.CITIES);
export const createCity = (data) => axiosInstance.post(API_ENDPOINTS.CITIES, data);

// Barangays
export const fetchBarangays = () => axiosInstance.get(API_ENDPOINTS.BARANGAYS);
export const createBarangay = (data) => axiosInstance.post(API_ENDPOINTS.BARANGAYS, data);