import axios from "axios";
import { API_ENDPOINTS } from "./apiEndpoints";
import axiosInstance from "./axiosInterceptor";

export const preRegisterAPI = async (email, facility_name, provider_type) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PRE_REGISTRATION, {
      provider_type,
      email,
      facility_name,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

// fetch pending providers
export const fetchPendingProvider = async (
  page,
  status = "pending",
  provider_type,
  search = ""
) => {
  try {
    let url = `${API_ENDPOINTS.PENDING_PROVIDERS}?page=${page}&status=${status}`;
    if (provider_type && provider_type !== "all") {
      url += `&provider_type=${provider_type}`;
    }

    // Add search parameter if provided
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const validateRegistrationToken = async (token) => {
  try {
    const response = await axios.get(
      API_ENDPOINTS.VALIDATE_REGISTER_TOKEN + `${token}/`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const approveProviderApplication = async (application_id) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.APPROVED_PROVIDER + `${application_id}/`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const rejectProviderApplication = async (
  application_id,
  reject_reason
) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.REJECT_PROVIDER + `${application_id}/`,
      {
        reject_reason: reject_reason,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
