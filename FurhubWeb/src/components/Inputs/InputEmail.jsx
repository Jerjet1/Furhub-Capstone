import React, { useState } from "react";
import { FiMail } from "react-icons/fi";

export const InputEmail = ({ id, name, placeholder, register, errors }) => {
  return (
    <div>
      <div
        className={`flex items-center border rounded px-3 py-2 focus-within:ring-1 ${
          errors ? "border-red-500" : "border-black"
        }`}>
        <FiMail className="to-black mr-2" />
        <input
          type="email"
          id={id}
          placeholder={placeholder}
          className="w-full outline-none bg-transparent"
          {...register(name)}
          autoCapitalize="none"
          autoComplete="off"
        />
      </div>
    </div>
  );
};
