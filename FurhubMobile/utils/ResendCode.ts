import { resendCodeAPI } from "@/services/api";

type Props = {
  email: string;
};

export const ResendCode = async ({
  email,
}: Props): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await resendCodeAPI(email);
    return {
      success: true,
      message: result.message || "Code resent successfully",
    };
  } catch (error: any) {
    let message = "Unexpected error occured";
    if (typeof error === "string") {
      message = error;
    } else if (typeof error.details === "string") {
      message = error.details;
    } else if (typeof error.detail === "string") {
      message = error.detail;
    } else if (typeof error.message === "string") {
      message = error.message;
    } else if (Array.isArray(error)) {
      message = error.join("\n");
    } else if (typeof error === "object") {
      message = Object.values(error).flat().join("\n");
    }
    return { success: false, message };
  }
};
