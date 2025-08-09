import axios from "axios";
import axiosInstance from "./axiosInterceptor";
import { API_URL } from "../config/config";

const PET_WALKER_PENDING_URL = new URL(
  "administrator/pending_pet_walker/",
  API_URL
).toString();
const PET_BOARDING_PENDING_URL = new URL(
  "administrator/pending_pet_boarding/",
  API_URL
).toString();

export const fetchPetWalkerUsers = async (page) => {
  const token = localStorage.getItem("token");
  try {
    // const response = await axios.get(`${PET_WALKER_PENDING_URL}?page=${page}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const response = await axiosInstance.get(
      `${PET_WALKER_PENDING_URL}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const fetchPetBoardingUsers = async (page) => {
  const token = localStorage.getItem("token");
  try {
    // const response = await axios.get(
    //   `${PET_BOARDING_PENDING_URL}?page=${page}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    const response = await axiosInstance.get(
      `${PET_BOARDING_PENDING_URL}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
