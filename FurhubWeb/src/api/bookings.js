import axiosInstance from "./axiosInterceptor";
import { API_ENDPOINTS } from "./apiEndpoints";

export const bookingAPI = {
  listBookingAPI: async (page, tab) => {
    try {
      // Map frontend tab values to backend status filters
      const statusMap = {
        requests: "pending",
        confirmed: "approved",
        ongoing: "active", // This will map to checked_in + ongoing
      };

      const statusParam = statusMap[tab] || tab;
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.PET_BOARDING_BOOKING_LIST}?page=${page}&tab=${statusParam}`
      );
      console.log("Booking data: ", response.data.results);
      return response.data;
    } catch (error) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
  approveBookingAPI: async (bookingId) => {
    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.PET_BOARDING_APPROVE_BOOKING}${bookingId}/`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
  declineBookingAPI: async (bookingId) => {
    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.PET_BOARDING_DECLINE_BOOKING}${bookingId}/`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { details: "Something went wrong" };
    }
  },
};
