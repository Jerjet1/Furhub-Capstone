import React from "react";

export const Button = ({ label }) => {
  return (
    <button
      type="submit"
      // className="w-full h-10 bg-indigo-500 hover:bg-indigo-900 text-xl font-semibold rounded-sm text-white cursor-pointer">
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 mt-2 text-lg cursor-pointer">
      {label}
    </button>
  );
};
