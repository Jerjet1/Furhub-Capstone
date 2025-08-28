import React, { useEffect, useState } from "react";
import {
  userDetailsAPI,
  UserDetails,
  petOwnerAPI,
  PetOwnerDetails,
} from "@/services/userAPI";
import { fetchProfileAPI } from "@/services/imageUpload";
import { ProfileContext } from "./profileContext";

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [petOwnerDetails, setPetOwnerDetails] =
    useState<PetOwnerDetails | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const [details, picture, ownerDetails] = await Promise.all([
        userDetailsAPI(),
        fetchProfileAPI(),
        petOwnerAPI(),
      ]);

      setUserDetails(details);
      setProfilePicture(picture);
      setPetOwnerDetails(ownerDetails);
    } catch (err: any) {
      setError(err?.details || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        userDetails,
        profilePicture,
        petOwnerDetails,
        loading,
        error,
        refreshProfile: loadProfile,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};
