import React from "react";
import Lottie from "lottie-react";
import spinner from "../assets/animations/catPaw.json";
export const LottieSpinner = ({ size = 100 }) => {
  return (
    <div className="flex justify-center items-center">
      <Lottie
        animationData={spinner}
        loop={true}
        autoPlay={true}
        style={{ width: size, height: size }}
      />
    </div>
  );
};
