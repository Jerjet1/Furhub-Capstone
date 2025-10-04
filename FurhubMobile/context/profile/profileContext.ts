import { createContext } from "react";
import { UserDetails, PetOwnerDetails } from "@/services/userAPI";

export interface ProfileContextType {
  userDetails: UserDetails | null;
  profilePicture: string | null;
  petOwnerDetails: PetOwnerDetails | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);
