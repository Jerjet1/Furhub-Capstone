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
