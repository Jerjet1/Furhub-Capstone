import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export const UserAvatar = ({ src, alt }) => {
  // Extract initials (first + last name)
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
    const lastInitial =
      parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };
  return (
    <Avatar className="w-10 h-10 bg-gray-900">
      <AvatarImage src={src || ""} alt={alt || "user"} />
      <AvatarFallback>{getInitials(alt)}</AvatarFallback>
    </Avatar>
  );
};
