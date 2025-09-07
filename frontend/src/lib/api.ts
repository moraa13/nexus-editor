import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});


