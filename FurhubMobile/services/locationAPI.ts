import { axiosInstance } from "./axiosInterceptor";
import { API_ENDPOINTS } from "./endpoints";

export const locationAPI = {
  createLocation: async (data: any) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOCATIONS, data);
    return response.data; // always return only data
  },

};
