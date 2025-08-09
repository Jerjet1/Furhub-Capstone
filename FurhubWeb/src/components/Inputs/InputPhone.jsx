import React from "react";
import { MdContactPhone } from "react-icons/md";

export const InputPhone = ({ id, name, placeholder, register, errors }) => {
  return (
    <div>
      <div
        className={`flex items-center border ${
          errors ? "border-red-500" : "border-black"
        } rounded px-3 py-2 focus-within:ring-1`}>
        <MdContactPhone className="to-black mr-2" />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id={id}
          {...register(name)}
          placeholder={placeholder}
          autoCapitalize="none"
          autoComplete="off"
          className="w-full outline-none bg-transparent"
          maxLength={11}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
        />
      </div>
    </div>
  );
};
