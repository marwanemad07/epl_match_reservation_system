import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

// To be used for all API calls
export const customFetch = axios.create({
  baseURL: backendUrl,
});
