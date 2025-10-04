import React, { useEffect, useState } from "react";
import {
  userDetailsAPI,
  UserDetails,
  petOwnerAPI,
  PetOwnerDetails,
} from "@/services/userAPI";
import { fetchProfileAPI } from "@/services/imageUpload";
import { ProfileContext } from "./profileContext";
import { useAuth } from "../useAuth";

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
  const { user } = useAuth();

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const [details, picture] = await Promise.all([
        userDetailsAPI.getDetails(),
        fetchProfileAPI(),
      ]);

      setUserDetails(details);
      setProfilePicture(picture);

      if (user?.activeRole?.toLowerCase() === "owner") {
        const ownerDetails = await petOwnerAPI.getPetOwner();
        setPetOwnerDetails(ownerDetails);
      } else if (user?.activeRole?.toLowerCase() === "walker") {
        setPetOwnerDetails(null);
      }
    } catch (err: any) {
      setError(err?.details || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setUserDetails(null);
      setProfilePicture(null);
      setPetOwnerDetails(null);
      return;
    }
    loadProfile();
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        userDetails,
        profilePicture,
        petOwnerDetails,
        loading,
        error,
        refreshProfile: loadProfile,
        clearProfile: async () => {
          setUserDetails(null);
          setProfilePicture(null);
          setPetOwnerDetails(null);
        },
      }}>
      {children}
    </ProfileContext.Provider>
  );
};
