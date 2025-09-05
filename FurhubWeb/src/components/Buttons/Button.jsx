import React from "react";

export const Button = ({ label }) => {
  return (
    <button
      type="submit"
      className="w-full h-10 bg-indigo-500 hover:bg-indigo-900 text-xl font-semibold rounded-sm text-white cursor-pointer">
      {label}
    </button>
  );
};
