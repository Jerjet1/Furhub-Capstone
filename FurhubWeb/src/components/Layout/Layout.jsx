import React from "react";
import { Link, useNavigate } from "react-router-dom";
export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen min-w-screen flex flex-col overflow-hidden bg-[url('/src/assets/doodlepets.png')] bg-cover bg-center">
      <header className="flex justify-start items-start p-1 bg-white/90 shadow-md">
        <div className="ml-10">
          {/* <h1 className="text-[40px] font-Fugaz">Furhub</h1> */}
          <Link to="/">
            <h1 className="text-[40px] font-Fugaz">Furhub</h1>
          </Link>
        </div>
      </header>
      {/* <main className="flex-1 flex flex-row justify-between px-14 gap-10">
        {children}
      </main> */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};
