// src/utils/auth.ts
export const TOKEN_KEYS = ["admin_token", "accessToken", "token"] as const;

export function getToken(): string | null {
  for (const k of TOKEN_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

export function setToken(token: string, key: (typeof TOKEN_KEYS)[number] = "admin_token") {
  localStorage.setItem(key, token);
}

export function clearToken() {
  TOKEN_KEYS.forEach((k) => localStorage.removeItem(k));
}

export function parseJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwt<{ exp?: number }>(token);
  if (!payload?.exp) return false; // if no exp, treat as non-expiring
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}
