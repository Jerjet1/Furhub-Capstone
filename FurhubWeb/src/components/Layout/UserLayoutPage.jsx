import React from "react";
import { FiBell } from "react-icons/fi";
import { AdminNavbar } from "../Navbar/AdminNavbar";
import { BoardingNavbar } from "../Navbar/BoardingNavbar";
import { Link, useLocation } from "react-router-dom";
export const UserLayoutPage = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const isPetboarding = path.includes("/Petboarding");
  const isReport = path.includes("/Admin/Reports");

  const navbarSelection = isReport ? "reports" : "default";

  return (
    <div className="w-screen h-screen flex flex-col bg-indigo-200">
      {/* Header */}
      <header className="bg-white/40 flex justify-between items-center">
        <h1 className="text-[20px] sm:text-[40px] font-Fugaz ml-5">Furhub</h1>
        <div className="flex justify-between w-full h-full ml-[50px]">
          <div className="flex space-x-5">
            {isPetboarding ? (
              <>
                <Link
                  to="/Petboarding/Dashboard"
                  className="border-b-0 hover:border-b-1 hover:border-b-amber-900 w-full h-full flex justify-center items-center">
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                </Link>

                <Link
                  to="/Petboarding/Reports"
                  className="border-b-0 hover:border-b-1 hover:border-b-amber-900 w-full h-full flex justify-center items-center">
                  <h2 className="text-xl font-semibold">Reports</h2>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/Admin/Dashboard"
                  className="border-b-0 hover:border-b-1 hover:border-b-amber-900 w-full h-full flex justify-center items-center">
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                </Link>

                <Link
                  to="/Admin/Reports"
                  className="border-b-0 hover:border-b-1 hover:border-b-amber-900 w-full h-full flex justify-center items-center">
                  <h2 className="text-xl font-semibold">Reports</h2>
                </Link>
              </>
            )}
          </div>
          <div className="flex justify-center items-center">
            <button className="bg-gray-400/40 p-1 sm:p-3 rounded-full hover:bg-gray-400/90 mr-5 cursor-pointer">
              <FiBell className="w-[10px] h-[10px] sm:w-[20px] sm:h-[20px]" />
            </button>
          </div>
        </div>
      </header>

      {/* main Content */}
      <div className="flex-1 flex min-h-0">
        {isPetboarding ? (
          <BoardingNavbar />
        ) : (
          <AdminNavbar section={navbarSelection} />
        )}
        <main className="flex-1 p-2 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
