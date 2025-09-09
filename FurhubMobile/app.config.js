import "dotenv/config";

export default {
  expo: {
    name: "furhubmobile",
    slug: "furhubmobile",
    version: "1.0.0",
    scheme: "furhubmobile", // 👈 add this (can be any unique string)
    userInterfaceStyle: "automatic",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
