import React from "react";
import { PiUserRectangle } from "react-icons/pi";
export const InputName = ({ id, name, placeholder, register, errors }) => {
  return (
    <div>
      <div
        className={`flex items-center border ${
          errors ? "border-red-500" : "border-black"
        } rounded px-3 py-2 focus-within:ring-1`}>
        <PiUserRectangle className="to-black mr-2" />
        <input
          type="text"
          id={id}
          {...register(name)}
          placeholder={placeholder}
          className="w-full outline-none bg-transparent"
          autoCapitalize="characters"
          autoComplete="off"
        />
      </div>
    </div>
  );
};
