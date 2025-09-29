import { API_URL } from "@/constant/config";

// API ENDPOINTS
export const USER_ENDPOINTS = {
  REFRESH_TOKEN: new URL("api/token/refresh/", API_URL).toString(),
  LOGIN: new URL("users/login/", API_URL).toString(),
  REGISTER: new URL("users/register/", API_URL).toString(),
  VERIFY_EMAIL: new URL("users/verify/", API_URL).toString(),
  RESEND_CODE: new URL("users/resend-code/", API_URL).toString(),
  CHECK_MAIL: new URL("users/check-email/", API_URL).toString(),
  FORGOT_PASSWORD: new URL("users/forgot-password/", API_URL).toString(),
  VERIFY_CODE: new URL("users/verify-code/", API_URL).toString(),
  RESET_PASSWORD: new URL("users/reset-password/", API_URL).toString(),
  CHANGE_PASSWORD: new URL("users/change-password/", API_URL).toString(),

  REQUIREMENTS_UPLOAD: new URL("users/image_upload/", API_URL).toString(),
  PROFILE_PICTURE: new URL("users/profile/", API_URL).toString(),

  USER_DETAILS: new URL("users/account-details/", API_URL).toString(),
  PET_OWNER_DETAILS: new URL("users/pet-owner-details/", API_URL).toString(),
} as const;

// Messaging endpoints (adjust paths to match your Django URLs)
export const MESSAGE_ENDPOINTS = {
  CONVERSATIONS: new URL("messages/conversations/", API_URL).toString(),
  CONVERSATION_GET_OR_CREATE: (otherUserId: number | string) =>
    new URL(`messages/conversations/get_or_create/?other_user_id=${otherUserId}`, API_URL).toString(),
  MESSAGES: (conversationId: number | string) =>
    new URL(`messages/conversations/${conversationId}/messages/`, API_URL).toString(),
  MESSAGE_DETAIL: (conversationId: number | string, messageId: number | string) =>
    new URL(`messages/conversations/${conversationId}/messages/${messageId}/`, API_URL).toString(),
  MARK_READ: (conversationId: number | string) =>
    new URL(`messages/conversations/${conversationId}/read/`, API_URL).toString(),
} as const;