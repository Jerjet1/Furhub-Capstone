import axios from "axios";
import { API_URL } from "../constant/config";

const forgotPasswordURL = new URL("users/forgot-password/", API_URL).toString();
const verifyCodeURL = new URL("users/verify-code/", API_URL).toString();
const ResetPasswordURL = new URL("users/reset-password/", API_URL).toString();
type sendEmailCode = {
  email: string;
};

export const ForgotPasswordAPI = async ({ email }: sendEmailCode) => {
  try {
    const response = await axios.post(forgotPasswordURL, { email });
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
    const response = await axios.post(verifyCodeURL, { email, code });
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
    const response = await axios.post(ResetPasswordURL, {
      email,
      new_password,
      confirm_password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};
