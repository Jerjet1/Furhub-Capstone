import { resendOTP } from "../api/authAPI";

export const resendCode = async (email) => {
  try {
    if (!email) return;
    const result = await resendOTP({ email });
    return console.log("code has been sent: ", result);
  } catch (error) {
    let message = "Login failed. Please try again.";

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
    return console.log("error", error);
  }
};
