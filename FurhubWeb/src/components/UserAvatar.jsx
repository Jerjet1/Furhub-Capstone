import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export const UserAvatar = ({ user }) => {
  return (
    <Avatar className="w-10 h-10 bg-gray-400">
      <AvatarImage src={user?.profilePic || ""} alt={user?.name || "user"} />
      <AvatarFallback>
        {/* <AvatarImage src="/src/assets/defaultPicture.png" /> */}
        KJ
      </AvatarFallback>
    </Avatar>
  );
};
