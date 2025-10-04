import React from "react";

export const ImageLayout = ({ src }) => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <img src={src} className="object-fill rounded-md h-[450px]" />
    </div>
  );
};
