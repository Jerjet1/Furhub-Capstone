import { debouncePromise } from "@/utils/debounce";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
export const API_URL =  "http://192.168.1.18:8000/"; //atay mani agad man sa ip address
const registerURL = new URL("users/register/", API_URL).toString();
const checkEmailURL = new URL("users/check-email", API_URL).toString();
const chatRoomsURL = new URL("chatrooms/get-or-create/", API_URL).toString();
const chatMessagesURL = new URL("chat/messages/", API_URL).toString();
const walkerRequirementsURL = new URL(
  "users/image_upload/",
  API_URL
).toString();
const loginURL = new URL("users/login/", API_URL).toString();
const resendCodeURL = new URL("users/resend-code/", API_URL).toString();
const verifyEmailURL = new URL("users/verify/", API_URL).toString();

type RegisterUser = {
  first_name: string;
  last_name: string;
  phone_no: string;
  email: string;
  password: string;
  confirm_password: string;
  role: "Owner" | "Walker";
};

type userCredentials = {
  email: string;
  password: string;
};

export const registerUser = async ({
  first_name,
  last_name,
  phone_no,
  email,
  password,
  confirm_password,
  role,
}: RegisterUser) => {
  try {
    const response = await axios.post(registerURL, {
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

export const requirementsUpload = async (FormData: any) => {
  try {
    const response = await axios.post(walkerRequirementsURL, FormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
    await axios.get(checkEmailURL, { params: { email } });
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
    const response = await axios.post(loginURL, { email, password });
    if (response.data.access) {
      await SecureStore.setItemAsync("token", response.data.access);
      if (response.data.role) {
        await SecureStore.setItemAsync(
          "roles",
          JSON.stringify(response.data.role)
        );
      }
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("role");
};

export const getRole = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("role");
};

export const resendCodeAPI = async (email: string) => {
  try {
    const response = await axios.post(resendCodeURL, { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const verifyEmailAPI = async (data: any) => {
  try {
    const response = await axios.post(verifyEmailURL, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

// Chat Room APIs
export const getOrCreateChatRoom = async (user2Id: number) => {
  try {
    const response = await axios.post(chatRoomsURL, { user2_id: user2Id });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Failed to get/create chat room" };
  }
};

export const getChatMessages = async (roomId: number) => {
  try {
    const response = await axios.get(chatMessagesURL, { params: { room: roomId } });
    return response.data.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp) // Convert string to Date
    }));
  } catch (error: any) {
    throw error.response?.data || { details: "Failed to fetch messages" };
  }
};

export const sendChatMessage = async (roomId: number, content: string, recipientId: number) => {
  try {
    const response = await axios.post(chatMessagesURL, {
      room: roomId,
      content,
      recipient: recipientId
    });
    return {
      ...response.data,
      timestamp: new Date(response.data.timestamp) // Convert string to Date
    };
  } catch (error: any) {
    throw error.response?.data || { details: "Failed to send message" };
  }
};

// Add this interceptor to automatically add tokens
axios.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// FOR API BASE URL OF AXIOX
const baseURL = 'http://192.168.1.18:8000'; // ✅ Your actual local IP address

const api = axios.create({
  baseURL,
});

// Add token interceptor to this axios instance
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { api, baseURL };
