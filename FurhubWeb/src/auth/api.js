import axios from "axios";

const API_URL = "http://192.168.1.24:8000/"; //bogo mani ip address
const loginURL = new URL("users/login/", API_URL).toString();
const registerURL = new URL("users/register/", API_URL).toString();
export const loginAuth = async (email, password) => {
  try {
    const response = await axios.post(loginURL, { email, password });
    if (response.data.access) {
      localStorage.setItem("token", response.data.access);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerAuth = async (
  first_name,
  last_name,
  phone_no,
  email,
  password,
  confirm_password
) => {
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
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
