import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export const InputPassword = ({ id, name, placeholder, register, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-2">
      <div
        className={`flex items-center border ${
          errors ? "border-red-500" : "border-black"
        } rounded px-3 py-2 focus-within:ring-1`}>
        <FiLock className="to-black mr-2" />
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          {...register(name)}
          className="w-full outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="focus:outline-none text-black"
          tabIndex={-1} // prevent tabbing into the icon button
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
};
