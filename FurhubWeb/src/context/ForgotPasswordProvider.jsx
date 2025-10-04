import React, { createContext, useContext, useEffect, useState } from "react";

export const ForgotPasswordContext = createContext(null);

export const ForgotPasswordProvider = ({ children }) => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const loadEmailStorage = () => {
      const email = sessionStorage.getItem("email");
      setEmail(email);
    };
    loadEmailStorage();
  }, [email]);

  const set_email = (email) => {
    sessionStorage.setItem("email", email);
    setEmail(email);
  };
  const remove_Email = () => {
    sessionStorage.removeItem("email");
    setEmail(null);
  };
  return (
    <ForgotPasswordContext.Provider
      value={{ email, set_email, setEmail, remove_Email }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPassword = () => {
  const context = useContext(ForgotPasswordContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
