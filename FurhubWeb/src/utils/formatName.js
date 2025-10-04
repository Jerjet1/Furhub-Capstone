export const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
  const lastInitial =
    parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
  return firstInitial + lastInitial;
};
