import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useProfile } from "../../context/useProfile";
import {
  Calendar,
  UserStar,
  Ticket,
  MessageCircle,
  IdCard,
  LogOut,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "../userAvatar";

export const BoardingNavbar = () => {
  const { logout, user } = useAuth();
  const { userDetails, profilePicture } = useProfile();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      logout(); // Call the logout function
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const textColor =
    user.pet_boarding_status === "approved" ? "text-[#26a37a]" : "text-red-400";

  const borderColor = ["unverified", "pending", "reject"].includes(
    user.pet_boarding_status
  )
    ? "border-red-400"
    : "border-[#26a37a]";

  return (
    <div className="w-full h-full">
      <nav className="h-full flex flex-col justify-between">
        <div className=" w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/Petboarding/ProfilePage"
                  className="block w-full rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 mb-1">
                  <div className="flex items-center gap-3 px-3 py-1">
                    <UserAvatar
                      src={profilePicture}
                      alt={`${userDetails?.first_name || ""} ${
                        userDetails?.last_name || ""
                      }`}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">
                        {userDetails?.first_name} {userDetails?.last_name}
                      </span>
                      <div className="space-x-2">
                        <span className="text-sm text-gray-500">
                          Pet Boarding
                        </span>
                        {/* <span
                          className={`text-[14px] ${textColor} border ${borderColor} px-1 rounded-lg`}>
                          {user.pet_boarding_status}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">
                  {userDetails?.first_name} {userDetails?.last_name}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <NavLink
            to="/Petboarding/Bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <Calendar className="h-5 w-5" />
            <h2 className="text-md">Bookings</h2>
          </NavLink>
          <NavLink
            to="/Petboarding/FacilityProfile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <IdCard className="w-5 h-5" />
            <h2 className="text-md">Facility Profile</h2>
          </NavLink>
          <NavLink
            to="/Petboarding/Reviews&Ratings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <UserStar className="h-5 w-5" />
            <h2 className="text-md">Reviews & Ratings</h2>
          </NavLink>
          <NavLink
            to="/Petboarding/Chats"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <MessageCircle className="w-5 h-5" />
            <h2 className="text-md">Chats</h2>
          </NavLink>
          <NavLink
            to="/Petboarding/Subscription"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <Ticket className="w-5 h-5" />
            <h2 className="text-md">Subscription</h2>
          </NavLink>
          <NavLink
            to="/Petboarding/Reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <FileText className="w-5 h-5" />
            <h2 className="text-md">Reports</h2>
          </NavLink>
        </div>
        <button
          type="button"
          onClick={handleLogout} // Use the handler function
          className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-[#616161] hover:bg-[#F5F5F5] hover:text-[#424242] cursor-pointer text-md">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </div>
  );
};
