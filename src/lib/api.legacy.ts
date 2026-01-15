// src/lib/api.ts
// DEPRECATED: Use @/lib/api/index.ts instead
// This file is kept for backward compatibility during migration

import axios from "axios";
import { getAuthToken, clearAuthTokens } from "@/lib/api/auth";

const api = axios.create({
  // Set VITE_API_BASE to full base: e.g. http://localhost:8001/api/v1
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8001/api/v1",
  withCredentials: false, // using Bearer token, not cookies
});

// Attach Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  config.headers = config.headers ?? {};
  if (token) {
    // axios v1 setter if available; fallback for older types
    (config.headers as any).set?.("Authorization", `Bearer ${token}`);
    if (!(config.headers as any).set) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Normalize 401 handling
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("[api] 401:", err.response.data || err.message);
      clearAuthTokens();
    }
    return Promise.reject(err);
  }
);

export default api;
