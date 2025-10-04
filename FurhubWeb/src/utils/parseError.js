export const parseError = (error) => {
  if (!error) return "Unexpected Error. Please try again.";

  // AxiosError-like object
  if (typeof error === "object" && error !== null) {
    const err = error;

    // Handle Axios error response
    if (err.response?.data) {
      return parseError(err.response.data);
    }

    if (typeof err.details === "string") return err.details;
    if (typeof err.detail === "string") return err.detail;
    if (typeof err.message === "string") return err.message;

    if (Array.isArray(err)) return err.join("\n");

    // Flatten values from error object
    try {
      return Object.values(err).flat().map(String).join("\n");
    } catch {
      return JSON.stringify(err);
    }
  }

  if (typeof error === "string") return error;

  return "Unexpected Error. Please try again.";
};
