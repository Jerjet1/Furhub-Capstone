import { debouncePromise } from "@/utils/debounce";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { axiosInstance } from "./axiosInterceptor";
import { USER_ENDPOINTS } from "./endpoints";

type RegisterUser = {
  first_name: string;
  last_name: string;
  phone_no: string;
  email: string;
  password: string;
  confirm_password: string;
  role: "Owner" | "Walker";
};

type ChangePasswordProps = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

type userCredentials = {
  email: string;
  password: string;
};

export const registerUserAPI = async ({
  first_name,
  last_name,
  phone_no,
  email,
  password,
  confirm_password,
  role,
}: RegisterUser) => {
  try {
    const response = await axiosInstance.post(USER_ENDPOINTS.REGISTER, {
      first_name,
      last_name,
      phone_no,
      email,
      password,
      confirm_password,
      role,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const checkEmailAvailability = async (
  email: string
): Promise<boolean> => {
  try {
    await axios.get(USER_ENDPOINTS.CHECK_MAIL, { params: { email } });
    // If 200, email does NOT exist (available)
    return false;
  } catch (error: any) {
    if (error.response?.status === 400 && error.response.data?.exist) {
      // If 400 and response is "exist: true", then email is in use
      return true;
    }
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const login = async ({ email, password }: userCredentials) => {
  try {
    const response = await axiosInstance.post(USER_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    if (response.data.access) {
      await SecureStore.setItemAsync("token", response.data.access);
      await SecureStore.setItemAsync("refresh", response.data.refresh);
      if (response.data.role) {
        await SecureStore.setItemAsync(
          "roles",
          JSON.stringify(response.data.role)
        );
      }
    }
    console.log("user id:", response.data.id);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("refresh");
  await SecureStore.deleteItemAsync("role");
};

export const getRole = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("role");
};

export const resendCodeAPI = async (email: string) => {
  try {
    const response = await axios.post(USER_ENDPOINTS.RESEND_CODE, { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const verifyEmailAPI = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      USER_ENDPOINTS.VERIFY_EMAIL,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const changePasswordAPI = async ({
  old_password,
  new_password,
  confirm_password,
}: ChangePasswordProps) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await axiosInstance.put(USER_ENDPOINTS.CHANGE_PASSWORD, {
      old_password,
      new_password,
      confirm_password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
