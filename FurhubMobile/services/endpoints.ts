import { API_URL } from "@/constant/config";

export const API_ENDPOINTS = {
  // Auth
  REFRESH_TOKEN: `${API_URL}api/token/refresh/`,
  LOGIN: `${API_URL}users/login/`,
  REGISTER: `${API_URL}users/register/`,
  VERIFY_EMAIL: `${API_URL}users/verify/`,
  RESEND_CODE: `${API_URL}users/resend-code/`,
  CHECK_MAIL: `${API_URL}users/check-email/`,
  FORGOT_PASSWORD: `${API_URL}users/forgot-password/`,
  VERIFY_CODE: `${API_URL}users/verify-code/`,
  RESET_PASSWORD: `${API_URL}users/reset-password/`,
  CHANGE_PASSWORD: `${API_URL}users/change-password/`,

  // User profile
  REQUIREMENTS_UPLOAD: `${API_URL}users/image_upload/`,
  PROFILE_PICTURE: `${API_URL}users/profile/`,
  USER_DETAILS: `${API_URL}users/account-details/`,
  PET_OWNER_DETAILS: `${API_URL}users/pet-owner-details/`,

POSTS: `${API_URL}posts/`,
COMMENTS: `${API_URL}comments/`,

  // ... other endpoints


  // Location
  LOCATIONS: `${API_URL}locations/`, // matches your router.register("locations", ...)
  CITIES: `${API_URL}dropdown/cities/`,
  BARANGAYS: `${API_URL}dropdown/barangays/`,
  STREETS: `${API_URL}dropdown/streets/`,
} as const;
