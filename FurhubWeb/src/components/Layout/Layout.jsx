import React from "react";
import { Link, useNavigate } from "react-router-dom";
export const Layout = ({ children }) => {
  // return (
  //   <div className="min-h-screen min-w-screen flex flex-col bg-indigo-200">
  //     <header className="bg-white/30 shadow-lg flex justify-between items-center p-2">
  //       <div>
  //         <h1 className="text-[40px] font-Fugaz ml-5">Furhub</h1>
  //       </div>
  //       <nav className="flex items-center space-x-4 mr-[40px]">
  //         <Link to="/">
  //           <h2 className="text-2xl font-semibold">Login</h2>
  //         </Link>
  //         <Link to="/register">
  //           <h2 className="text-2xl font-semibold">Register</h2>
  //         </Link>
  //       </nav>
  //     </header>
  //     <main className="flex-1 flex items-center justify-center p-5">
  //       {children}
  //     </main>
  //   </div>
  // );
  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-white">
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
