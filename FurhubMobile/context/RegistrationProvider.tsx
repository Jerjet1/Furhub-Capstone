import React, { createContext, useContext, useState } from "react";

interface RegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  password: string;
  confirm_password: string;
}

interface UploadedImages {
  barangayClearance: any;
  validID: any;
  selfieWithID: any;
}

interface RegistrationContextType {
  formData: RegistrationData;
  setFormData: (data: RegistrationData) => void;
  uploadedImages: UploadedImages;
  // setUploadedImages: (data: UploadedImages) => void;
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImages>>;
}

const RegistrationContext = createContext<RegistrationContextType | null>(null);

export const RegistrationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<RegistrationData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    password: "",
    confirm_password: "",
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({
    barangayClearance: null,
    validID: null,
    selfieWithID: null,
  });

  return (
    <RegistrationContext.Provider
      value={{ formData, setFormData, uploadedImages, setUploadedImages }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context)
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  return context;
};
