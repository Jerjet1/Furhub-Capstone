import React, { useState } from "react";
import { MdContactPhone } from "react-icons/md";
import { handleNumberChange } from "../../utils/handler";
export const InputPhone = ({ id, name, placeholder, register, errors }) => {
  const [value, setValue] = useState("");
  return (
    <div>
      <div
        className={`flex items-center border ${
          errors ? "border-red-500" : "border-black"
        } rounded px-3 py-2 focus-within:ring-1`}>
        <MdContactPhone className="to-black mr-2" />
        <input
          type="text"
          id={id}
          {...register(name)}
          value={value}
          maxLength={11}
          onChange={(e) => handleNumberChange(e, setValue)}
          placeholder={placeholder}
          autoCapitalize="none"
          autoComplete="off"
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>
  );
};
