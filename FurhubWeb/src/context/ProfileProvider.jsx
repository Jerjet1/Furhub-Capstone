import React, { useEffect, useState } from "react";
import { fetchProfileAPI } from "../api/imageUpload";
import { userDetailsAPI } from "../api/Users";
import { ProfileContext } from "./ProfileContext";
import { useAuth } from "./useAuth";

export const ProfileProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    } catch (error) {
      console.log(error?.details || "failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setProfilePicture(null);
      setUserDetails(null);
      return;
    }
    loadProfile();
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        userDetails,
        profilePicture,
        loading,
        error,
        refreshProfile: loadProfile,
        clearProfile: async () => {
          setUserDetails(null);
          setProfilePicture(null);
        },
      }}>
      {children}
    </ProfileContext.Provider>
  );
};
