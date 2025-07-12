import { axios } from "axios";

const API_URL = "http://192.168.1.2:8000/"; //bogo mani ip address
const PENDING_PROVIDERS = new URL(
  "admin/pending_providers/",
  API_URL
).toString();
// const PET_WALKER_PENDING_URL = new URL(
//   "admin/pending_pet_walker/",
//   API_URL
// ).toString();
// const PET_OWNER_PENDING_URL = new URL(
//   "admin/pending_pet_walker/",
//   API_URL
// ).toString();

export const getPendingProviders = async () => {
  try {
    const response = await axios.get(PENDING_PROVIDERS);
    const combine_data = [
      ...response.data.pet_walkers,
      ...response.data.pet_boardings,
    ];
    return combine_data;
  } catch (error) {
    throw error.response?.data || { details: "Something went wrong" };
  }
};

// export const getPendingPetWalkers = async () => {
//   try {
//     const response = await axios.get(PET_WALKER_PENDING_URL);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { details: "Something went wrong" };
//   }
// };

// export const getPendingBoarding = async () => {
//   try {
//     const response = await axios.get(PET_OWNER_PENDING_URL);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { details: "Something went wrong" };
//   }
// };
