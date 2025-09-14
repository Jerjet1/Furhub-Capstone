import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserAvatar } from "../userAvatar";
import { useAuth } from "../../context/useAuth";
import { Users, MapPin, CreditCard, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProfile } from "../../context/useProfile";

export const AdminNavbar = () => {
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
  return (
    <div className="w-full h-full">
      <nav className="h-full flex flex-col justify-between">
        <div className="space-y-2 w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/Admin/ProfilePage"
                  className="block w-full rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                  <div className="flex items-center gap-3 px-3 py-1">
                    <UserAvatar
                      src={profilePicture}
                      alt={`${userDetails?.first_name} ${userDetails?.last_name}`}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">
                        {userDetails?.first_name} {userDetails?.last_name}
                      </span>
                      <span className="text-sm text-gray-500">Admin</span>
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
            to="/Admin/ManageLocation"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <MapPin className="w-5 h-5" />
            <h2 className="text-md">Manage Location</h2>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <CreditCard className="w-5 h-5" />
            <h2 className="text-md">View Subscriptions</h2>
          </NavLink>
          <NavLink
            to="/Admin/ManageUsers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
            ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`
            }>
            <Users className="w-5 h-5" />
            <h2 className="text-md">Manage Users</h2>
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
