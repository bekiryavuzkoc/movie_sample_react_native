export const API_CONFIG = {
  env: "prod" as "prod" | "staging" | "dev",
  urls: {
    prod: "https://api.sampleapis.com/movies",
    staging: "https://api.sampleapis.com/movies",
    dev: "https://api.sampleapis.com/movies",
  },
};

export const BASE_URL = API_CONFIG.urls[API_CONFIG.env];