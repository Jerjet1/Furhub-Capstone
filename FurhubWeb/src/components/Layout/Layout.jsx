import React from "react";
import { Link, useNavigate } from "react-router-dom";
export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-white overflow-hidden">
      <header className="flex justify-start items-start p-1">
        <div className="ml-10">
          <h1 className="text-[40px] font-Fugaz">Furhub</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-row justify-between px-14 gap-10">
        {children}
      </main>
    </div>
  );
};
