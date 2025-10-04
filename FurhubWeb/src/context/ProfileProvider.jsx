import React, { useEffect, useState, useCallback } from "react";
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
  const [lastRefresh, setLastRefresh] = useState(0);

  // Memoize loadProfile to prevent unnecessary recreations
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [details, picture] = await Promise.all([
        userDetailsAPI.getDetails(),
        fetchProfileAPI(),
      ]);
      setUserDetails(details);
      setProfilePicture(picture);
      setLastRefresh(Date.now()); // Track when we last refreshed
    } catch (error) {
      console.log(error?.details || "failed to load profile");
      setError(error?.details || "failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setProfilePicture(null);
      setUserDetails(null);
      setLoading(false);
      return;
    }

    // Only load profile if we don't have data or it's been more than 5 minutes
    const shouldRefresh =
      !userDetails || Date.now() - lastRefresh > 5 * 60 * 1000;

    if (shouldRefresh) {
      loadProfile();
      console.log("Profile provider - loading profile");
    } else {
      console.log("Profile provider - using cached data");
    }
  }, [user, userDetails, lastRefresh, loadProfile]);

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
          setLastRefresh(0);
        },
      }}>
      {children}
    </ProfileContext.Provider>
  );
};
