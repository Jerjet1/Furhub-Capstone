export const parseError = (error: unknown): string => {
  if (!error) return "Unexpected Error please try again.";

  // AxiosError has response?.data
  if (typeof error === "object" && error !== null) {
    const err = error as any;

    // Handle Axios error
    if (err.response?.data) {
      return parseError(err.response.data);
    }

    if (typeof err.details === "string") return err.details;
    if (typeof err.detail === "string") return err.detail;
    if (typeof err.message === "string") return err.message;

    if (Array.isArray(error)) return error.join("\n");

    return Object.values(err).flat().map(String).join("\n");
  }

  if (typeof error === "string") return error;

  return "Unexpected Error please try again.";
};
