import axios from "axios";

const API_URL = "http://192.168.1.2:8000/"; //bogo mani ip address
const serviceURL = new URL("users/service_list/", API_URL).toString();
export const service_list = async () => {
  try {
    const response = await axios.get(serviceURL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
