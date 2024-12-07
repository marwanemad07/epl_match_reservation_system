import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

// to be used for all API calls
export const customFetch = axios.create({
  baseURL: backendUrl,
  headers: { Authorization: "Bearer " + localStorage.getItem("token") }, // TODO: may change the token storage later
});
