import axios from "axios";

export const locationAPI = {
  getLatestLocation: async () => {
    const response = await axios.get("/api/location/latest/"); // Django endpoint for latest location
    return response.data;
  },
};
