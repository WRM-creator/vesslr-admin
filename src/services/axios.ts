// src/services/axios.ts
// DEPRECATED: Use @/lib/api/index.ts with generated client instead
import Axios from "axios";
import { getAuthToken, clearAuthTokens } from "@/lib/api/auth";

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearAuthTokens();
    }
    return Promise.reject(err);
  }
);

export default api;
