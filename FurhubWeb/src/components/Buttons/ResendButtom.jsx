import React, { useEffect, useState } from "react";

const RESEND_TIMER = 30;

export const ResendButtom = ({ onResend, timerDuration = RESEND_TIMER }) => {
  const [timer, setTimer] = useState(0);
  const [resend, setResend] = useState(true);

  useEffect(() => {
    const storedExpiry = localStorage.getItem("resendExpiry");

    if (storedExpiry) {
      const remaining = Math.floor((storedExpiry - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        setResend(false);
      } else {
        setResend(true);
        localStorage.removeItem("resendExpiry");
      }
    }
  }, []); // runs once on mount

  useEffect(() => {
    let interval = null;

    if (!resend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResend(true);
            localStorage.removeItem("resendExpiry");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resend, timer]);

  const handleResend = async () => {
    try {
      await onResend(); // calls API from parent
      const expiryTime = Date.now() + timerDuration * 1000;
      localStorage.setItem("resendExpiry", expiryTime);
      setResend(false);
      setTimer(timerDuration);
    } catch (error) {
      console.error("Resend failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={!resend}
      className={`${
        resend
          ? "text-blue-500 hover:text-blue-900 underline cursor-pointer"
          : "text-gray-400 cursor-not-allowed"
      }`}>
      {resend ? "Resend" : `Resend in ${timer}s`}
    </button>
  );
};
