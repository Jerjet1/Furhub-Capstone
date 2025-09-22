import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";

type sendEmailCode = {
  email: string;
};

export const ForgotPasswordAPI = async ({ email }: sendEmailCode) => {
  try {
    const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

type VerifyCodeProps = {
  email: string;
  code: string;
};

export const VerifyCode = async ({ email, code }: VerifyCodeProps) => {
  try {
    const response = await axios.post(API_ENDPOINTS.VERIFY_CODE, {
      email,
      code,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

type ResetPasswordProps = {
  email: string;
  new_password: string;
  confirm_password: string;
};

export const ResetPassword = async ({
  email,
  new_password,
  confirm_password,
}: ResetPasswordProps) => {
  try {
    const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
      email,
      new_password,
      confirm_password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
