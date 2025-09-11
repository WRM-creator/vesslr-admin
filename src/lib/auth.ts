// src/lib/auth.ts
const KEY = "adminToken";

export function saveToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(KEY);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

// Optional: JWT helpers
export function parseJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
export function isExpired(token: string): boolean {
  const p = parseJwt<{ exp?: number }>(token);
  if (!p?.exp) return false;
  return p.exp <= Math.floor(Date.now() / 1000);
}
