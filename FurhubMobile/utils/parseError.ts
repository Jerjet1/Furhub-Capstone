// export const parseError = (error: any) => {
//   if (!error) return "Unexpected error occurred, please try again";
//   if (typeof error === "string") return error;
//   if (typeof error?.details === "string") return error.details;
//   if (typeof error?.detail === "string") return error.detail;
//   if (typeof error?.message === "string") return error.message;
//   if (Array.isArray(error)) return error.join("\n");
//   if (typeof error === "object") return Object.values(error).flat().join("\n");

//   return "Unexpected Error please try again.";
// };
export const parseError = (error: unknown): string => {
  if (!error) return "Unexpected Error please try again.";

  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    if (typeof err.details === "string") return err.details;
    if (typeof err.detail === "string") return err.detail;
    if (typeof err.message === "string") return err.message;

    // Handle arrays (e.g., validation errors)
    if (Array.isArray(error)) return error.join("\n");

    // Handle object with values
    return Object.values(err).flat().map(String).join("\n");
  }

  return "Unexpected Error please try again.";
};
