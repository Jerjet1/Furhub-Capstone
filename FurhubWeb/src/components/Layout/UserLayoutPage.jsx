import React, { useState } from "react";
import { Bell } from "lucide-react";
import { AdminNavbar } from "../Navbar/AdminNavbar";
import { BoardingNavbar } from "../Navbar/BoardingNavbar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const UserLayoutPage = ({ children }) => {
  const [activeTab, setActiveTab] = useState("all");
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
        <div className="flex-1">
          {isPetboarding ? <BoardingNavbar /> : <AdminNavbar />}
        </div>
      </aside>

      {/* Right Side (Topbar + Content) */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Topbar with notification button*/}
        <nav className="bg-white/40 flex justify-end items-center px-4 py-2 shadow">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] bg-transparent mr-2">
                <Bell className="h-4 w-4 text-black" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] max-h-64 overflow-y-auto"
              align="end">
              <div className="font-medium mb-2 text-lg">Notifications</div>
              {/* Tabs */}
              <div className="flex gap-3 mb-3">
                <Button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 ${
                    activeTab === "all"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "border-[#E0E0E0] text-[#616161] bg-transparent hover:bg-[#F5F5F5]"
                  }`}>
                  All
                </Button>
                <Button
                  onClick={() => setActiveTab("unread")}
                  className={`px-3 py-1 ${
                    activeTab === "unread"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "border-[#E0E0E0] text-[#616161] bg-transparent hover:bg-[#F5F5F5]"
                  }`}>
                  Unread
                </Button>
              </div>

              {/* Notification list */}
              <div className="space-y-2">
                {activeTab === "all" ? (
                  <p className="text-gray-500 text-sm text-center">
                    No notifications
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm text-center">
                    No unread notifications
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-5 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
