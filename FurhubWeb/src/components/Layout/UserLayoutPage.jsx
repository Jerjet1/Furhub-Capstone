import React from "react";
import { Bell } from "lucide-react";
import { AdminNavbar } from "../Navbar/AdminNavbar";
import { BoardingNavbar } from "../Navbar/BoardingNavbar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
export const UserLayoutPage = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const isPetboarding = path.includes("/Petboarding");
  return (
    <div className="w-screen h-screen flex bg-[#F7F7F6]">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-[#FAFAFA] border-r border-[#E0E0E0] px-2">
        <div className="py-2 text-center">
          <h1 className="text-[40px] text-[#212121] font-Fugaz">Furhub</h1>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto">
          {isPetboarding ? <BoardingNavbar /> : <AdminNavbar />}
        </div>
      </aside>

      {/* Right Side (Topbar + Content) */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Topbar with notification button*/}
        <nav className="bg-white/40 flex justify-end items-center px-4 py-2 shadow">
          <Button
            variant="outline"
            size="icon"
            className="border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] bg-transparent mr-2">
            <Bell className="h-4 w-4 text-black" />
          </Button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-5 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
