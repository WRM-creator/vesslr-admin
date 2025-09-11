// src/services/axios.ts
import Axios from "axios";
import { getToken, clearToken } from "@/utils/auth";

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001", // adjust as needed
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Optional: if unauthorized, clear token and bounce to login
    if (err?.response?.status === 401) {
      clearToken();
      // window.location.assign("/admin/auth/login");
    }
    return Promise.reject(err);
  }
);

export default api;
