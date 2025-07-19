import React from "react";

export const Avatar = ({ src, size = 40, onclick }) => {
  return (
    <div
      className={`w-[${size}px] h-[${size}px] rounded-full overflow-hidden cursor-${
        onclick ? "pointer" : "default"
      }flex items-center justify-center bg-[#eee] select-none`}
      onClick={onclick}>
      {src ? (
        <img src={src} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <img
          src="../assets/defaultProfile.png"
          alt="default profile"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
