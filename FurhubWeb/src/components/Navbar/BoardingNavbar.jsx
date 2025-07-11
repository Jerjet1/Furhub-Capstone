import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
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
    <div className="w-fit border-e-gray-700 min-h-0">
      <nav className="h-full flex flex-col justify-between bg-white/20">
        <div className="mt-5 w-full">
          <Link
            to=""
            className="block py-3 px-5 hover:bg-gray-600/30 hover:border-e-1">
            <h2>Bookings</h2>
          </Link>
          <Link
            to="/Petboarding/FacilityProfile"
            className="block py-3 px-5 hover:bg-gray-600/30 hover:border-e-1">
            <h2>Facility Profile</h2>
          </Link>
          <Link
            to=""
            className="block py-3 px-5 hover:bg-gray-600/30 hover:border-e-1">
            <h2>Reviews & Ratings</h2>
          </Link>
          <Link
            to=""
            className="block py-3 px-5 hover:bg-gray-600/30 hover:border-e-1">
            <h2>Chats</h2>
          </Link>
          <Link
            to=""
            className="block py-3 px-5 hover:bg-gray-600/30 hover:border-e-1">
            <h2>Subscription</h2>
          </Link>
        </div>
        <button
          type="button"
          onClick={handleLogout} // Use the handler function
          className="block px-5 py-3 hover:border-e-1 hover:bg-gray-600/30 cursor-pointer text-start">
          Logout
        </button>
      </nav>
    </div>
  );
};
