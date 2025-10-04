const API_URL = import.meta.env.VITE_API_URL; // ensure this ends with /

export const API_ENDPOINTS = {
  // Auth
  REFRESH_TOKEN: `${API_URL}api/token/refresh/`,
  LOGIN: `${API_URL}users/login/`,
  REGISTER: `${API_URL}users/provider/register/`, // Provider Registration
  VALIDATE_REGISTER_TOKEN: `${API_URL}users/provider/register/`, //validate registration token
  RESEND_LINK: `${API_URL}users/resend-link/`, //resend link for registration
  VERIFY_EMAIL: `${API_URL}users/verify/`,
  RESEND_CODE: `${API_URL}users/resend-code/`,
  CHECK_MAIL: `${API_URL}users/check-email/`,
  FORGOT_PASSWORD: `${API_URL}users/forgot-password/`,
  VERIFY_CODE: `${API_URL}users/verify-code/`,
  RESET_PASSWORD: `${API_URL}users/reset-password/`,
  CHANGE_PASSWORD: `${API_URL}users/change-password/`,
  PRE_REGISTRATION: `${API_URL}users/pre-register/`,
  REQUIREMENTS_UPLOAD: `${API_URL}users/documents_upload/`,
  PROFILE_PICTURE: `${API_URL}users/profile/`,
  USER_DETAILS: `${API_URL}users/account-details/`,
  // Provider
  PET_BOARDING_DETAILS: `${API_URL}users/pet-boarding-details/`,
  PET_BOARDING_BOOKING_LIST: `${API_URL}boarding/list_bookings/`,
  PET_BOARDING_APPROVE_BOOKING: `${API_URL}boarding/approve_booking/`,
  PET_BOARDING_DECLINE_BOOKING: `${API_URL}boarding/decline_booking/`,

  // Admin
  USERS: `${API_URL}administrator/all_users/`,
  PENDING_PROVIDERS: `${API_URL}administrator/pending_applications/`,
  APPROVED_PROVIDER: `${API_URL}administrator/provider_applications/approve/`,
  REJECT_PROVIDER: `${API_URL}administrator/provider_applications/reject/`,

  // Locations / Service Areas
  PROVINCES: `${API_URL}administrator/provinces/`,
  CITIES: `${API_URL}administrator/cities/`,
  BARANGAYS: `${API_URL}administrator/barangays/`,
  LOCATIONS: `${API_URL}administrator/locations/`,
  SERVICE_AREAS: `${API_URL}administrator/service-areas/`,
};
