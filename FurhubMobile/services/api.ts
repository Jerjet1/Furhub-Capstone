import axios from "axios";
import * as SecureStore from "expo-secure-store";
const API_URL = "http://192.168.1.3:8000/";
const registerURL = new URL("users/register/", API_URL).toString();
const loginURL = new URL("users/login/", API_URL).toString();

type RegisterUser = {
  first_name: string;
  last_name: string;
  phone_no: string;
  email: string;
  password: string;
  confirm_password: string;
};

export const registerUser = async ({
  first_name,
  last_name,
  phone_no,
  email,
  password,
  confirm_password,
}: RegisterUser) => {
  try {
    const response = await axios.post(registerURL, {
      first_name,
      last_name,
      phone_no,
      email,
      password,
      confirm_password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

type userCredentials = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: userCredentials) => {
  try {
    const response = await axios.post(loginURL, { email, password });
    if (response.data.access) {
      // localStorage.setItem("token", response.data.access);
      await SecureStore.setItemAsync("token", response.data.access);
      // localStorage.setItem('role', response.data.role);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const getRole = () => {
  localStorage.getItem("role");
};
