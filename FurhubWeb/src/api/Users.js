import axios from "axios";
import axiosInstance from "./axiosInterceptor";
import { API_URL } from "../config/config";

const UsersURL = new URL("administrator/all_users/", API_URL).toString();

export const fetchUsers = async (page) => {
  const token = localStorage.getItem("token");

  try {
    // const response = await axios.get(`${UsersURL}?page=${page}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const response = await axiosInstance.get(`${UsersURL}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log(localStorage.getItem("token"));
    // console.log(localStorage.getItem("refresh"));
    // console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    // console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { details: "Something went wrong" };
  }
};
