import axios from "axios";
import { API_URL } from "./authAPI";

const serviceURL = new URL("users/service_list/", API_URL).toString();
export const service_list = async () => {
  try {
    const response = await axios.get(serviceURL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
