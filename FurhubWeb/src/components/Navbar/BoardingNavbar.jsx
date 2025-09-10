import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  Bell,
  Home,
  Users,
  Calendar,
  UserStar,
  User,
  Ticket,
  MessageCircle,
  IdCard,
  LogOut,
  FileText,
} from "lucide-react";
import { UserAvatar } from "../userAvatar";
export const BoardingNavbar = () => {
  const { logout } = useAuth();
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
      <nav className="h-full flex flex-col justify-between ">
        <div className="space-y-2 w-full">
          <NavLink
            to="/Petboarding/ProfilePage"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`
            }>
            <UserAvatar />
            {/* User Info (stacked vertically) */}
            <div className="flex flex-col">
              <span className="font-medium">John Doe</span>
              <div className="space-x-2">
                <span className="text-sm text-gray-500">Pet Boarding</span>
                <span className="text-sm text-red-400 border border-red-400 px-2 rounded-lg">
                  Pending
                </span>
              </div>
            </div>
          </NavLink>
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium`
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
