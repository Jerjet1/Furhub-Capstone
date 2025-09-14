// api.ts
import axios, { AxiosResponse } from "axios";

const API_URL = "http://10.0.0.39:8000/community/"; // your LAN IP

const API = axios.create({
  baseURL: API_URL,
});

// ==== Types ====
export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: string;
}

export interface Comment {
  id: number;
  post: number;
  content: string;
  image?: string;
  created_at: string;
}

export type ReactionType = "like" | "heart" | "paw";

// ==== Endpoints ====
export const getPosts = (): Promise<AxiosResponse<Post[]>> =>
  API.get("posts/");

export const createPost = (
  formData: FormData
): Promise<AxiosResponse<Post>> =>
  API.post("posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const createComment = (
  formData: FormData
): Promise<AxiosResponse<Comment>> =>
  API.post("comments/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const reactComment = async (
  commentId: number,
  type: ReactionType
): Promise<AxiosResponse<any>> => {
  return axios.post(
    `http://10.0.0.39:8000/comments/${commentId}/react/`,
    { reaction_type: type }
  );
};

export const likePost = (id: number): Promise<AxiosResponse<any>> =>
  API.post(`posts/${id}/like/`);

export const reactPost = (
  postId: number,
  reactionType: ReactionType
): Promise<AxiosResponse<any>> =>
  API.post(`posts/${postId}/react/`, { reaction_type: reactionType });

export const getFullImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  // Use your server LAN IP and port
  return `http://10.0.0.39:8000${path}`;
};

export const updatePost = async (
  postId: number,
  data: FormData | Partial<Post>,
  isMultipart: boolean = false
): Promise<AxiosResponse<Post>> => {
  try {
    if (isMultipart) {
      return await axios.put(
        `http://10.0.0.39:8000/posts/${postId}/`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      return await axios.put(
        `http://10.0.0.39:8000/posts/${postId}/`,
        data
      );
    }
  } catch (err: any) {
    console.log("API updatePost error:", err.response?.data || err.message);
    throw err;
  }
};

export const deletePost = async (
  postId: number
): Promise<AxiosResponse<void>> => {
  return await axios.delete(`http://10.0.0.39:8000/posts/${postId}/`);
};
