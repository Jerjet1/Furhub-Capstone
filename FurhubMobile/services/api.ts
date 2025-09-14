import { debouncePromise } from "@/utils/debounce";
import * as SecureStore from "expo-secure-store";
import { axiosInstance } from "./axiosInterceptor";
import { API_ENDPOINTS } from "./endpoints";
import axios, { AxiosResponse } from 'axios';

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

// Types
export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at?: string;
  reactions?: Reaction[];
  comments?: Comment[];
}

export interface Comment {
  id: number;
  post: number;
  content: string;
  image?: string;
  created_at?: string;
  reactions?: Reaction[];
}

export interface Reaction {
  reaction_type: 'like' | 'heart' | 'paw';
  user_id: number;
}

// API functions

export const getPosts = () => axiosInstance.get(API_ENDPOINTS.POSTS);

export const createPost = (formData: FormData) =>
  axiosInstance.post(API_ENDPOINTS.POSTS, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const createComment = (formData: FormData | { post: number; content: string }) =>
  axiosInstance.post(API_ENDPOINTS.COMMENTS, formData, {
    headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });

export const reactPost = (postId: number, reactionType: 'like' | 'heart' | 'paw') =>
  axiosInstance.post(`${API_ENDPOINTS.POSTS}${postId}/react/`, { reaction_type: reactionType });

export const likePost = (postId: number) =>
  axiosInstance.post(`${API_ENDPOINTS.POSTS}${postId}/like/`);

export const updatePost = (postId: number, data: FormData | Partial<Post>, isMultipart = false) =>
  axiosInstance.put(`${API_ENDPOINTS.POSTS}${postId}/`, data, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);

export const deletePost = (postId: number) =>
  axiosInstance.delete(`${API_ENDPOINTS.POSTS}${postId}/`);
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
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, {
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
    await axios.get(API_ENDPOINTS.CHECK_MAIL, { params: { email } });
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
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
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
    const response = await axios.post(API_ENDPOINTS.RESEND_CODE, { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

export const verifyEmailAPI = async (data: any) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, data);
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
    const response = await axiosInstance.put(API_ENDPOINTS.CHANGE_PASSWORD, {
      old_password,
      new_password,
      confirm_password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};



export const locationAPI = {
  // Create new location
  createLocation: async (data: {
    province: string;
    city: string;
    barangay: string;
    street: string;
    latitude: number;
    longitude: number;
  }) => {
    return await axiosInstance.post(API_ENDPOINTS.LOCATIONS, data);
  },

  getLocations: async () => {
    return await axiosInstance.get(API_ENDPOINTS.LOCATIONS);
  },

  getLocation: async (id: number) => {
    return await axiosInstance.get(`${API_ENDPOINTS.LOCATIONS}${id}/`);
  },

  updateLocation: async (id: number, data: any) => {
    return await axiosInstance.put(`${API_ENDPOINTS.LOCATIONS}${id}/`, data);
  },

  deleteLocation: async (id: number) => {
    return await axiosInstance.delete(`${API_ENDPOINTS.LOCATIONS}${id}/`);
  },
};


