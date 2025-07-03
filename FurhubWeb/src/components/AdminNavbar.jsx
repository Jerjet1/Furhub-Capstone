import React from "react";
import { Link, useNavigate } from "react-router-dom";
export const AdminNavbar = ({ section }) => {
  return (
    <div className="w-fit border-e-gray-700 min-h-0">
      <nav className="h-full flex flex-col justify-between bg-white/20">
        <div className="mt-5 w-full">
          {section === "reports" ? (
            <>
              <Link to="" className="py-3 px-5 hover:bg-gray-600/30  block ">
                <h2>Report Summary</h2>
              </Link>
              <Link to="" className="py-3 px-5 hover:bg-gray-600/30  block ">
                <h2>User Logs</h2>
              </Link>
              <Link to="" className="py-3 px-5 hover:bg-gray-600/30  block ">
                <h2>Revenue</h2>
              </Link>
            </>
          ) : (
            <>
              <Link to="" className="block py-3 px-5 hover:bg-gray-600/30 ">
                <h2>Manage Location</h2>
              </Link>
              <Link to="" className="block py-3 px-5 hover:bg-gray-600/30 ">
                <h2>View Subscriptions</h2>
              </Link>
              <Link
                to="/Admin/ManageUsers/"
                className="block py-3 px-5 hover:bg-gray-600/30 ">
                <h2>Manage Users</h2>
              </Link>
            </>
          )}
        </div>
        <div className="block px-5 py-3  hover:bg-gray-600/30 ">Logout</div>
      </nav>
    </div>
  );
};
