import React, { useEffect } from "react";

export const Toast = ({ error, setError, duration = 3000 }) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [error, duration, setError]);

  if (!error) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md relative text-[20px]">
        <span className="block sm:inline ml-2">{error}</span>
        <button
          onClick={() => setError("")}
          className="absolute top-0 right-0 mt-2 mr-2 text-red-500 hover:text-red-700 text-xl font-bold">
          &times;
        </button>
      </div>
    </div>
  );
};
