import React, { useState, useRef } from "react";

export const InputOTP = ({ onComplete, errors }) => {
  const [code, setCode] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
      if (onComplete) {
        onComplete(value);
      }
    }
  };

  return (
    <div className="flex gap-[10px] justify-start w-full h-[50px] rounded-4xl">
      <input
        type="text"
        value={code}
        onChange={handleChange}
        maxLength={6}
        inputMode="numeric"
        placeholder="Enter 6 digit Code"
        autoFocus
        className={`w-full h-[50px]  text-[25px]  border-1 rounded-sm p-2 ${
          errors ? "border-red-500" : "border-black"
        }`}
      />
    </div>
  );
};
