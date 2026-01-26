/**
 * Auth utilities for managing authentication state.
 * Centralized for consistency with the API layer.
 */

const TOKEN_KEYS = {
  accessToken: "admin_auth_token",
  refreshToken: "admin_refresh_token",
  expiresAt: "admin_expires_at",
} as const;

export const AUTH_LOGOUT_EVENT = "auth:logout";

/**
 * Get the current auth token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS.accessToken);
}

/**
 * Get the refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS.refreshToken);
}

/**
 * Check if user is authenticated (has a valid token)
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  // Check expiration if available
  const expiresAt = localStorage.getItem(TOKEN_KEYS.expiresAt);
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    if (expiryDate <= new Date()) {
      return false;
    }
  }

  return true;
}

/**
 * Save auth tokens to storage
 */
export function saveAuthTokens(
  accessToken: string,
  refreshToken?: string,
  expiresAt?: string,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEYS.accessToken, accessToken);
  if (refreshToken) {
    localStorage.setItem(TOKEN_KEYS.refreshToken, refreshToken);
  }
  if (expiresAt) {
    localStorage.setItem(TOKEN_KEYS.expiresAt, expiresAt);
  }
}

/**
 * Clear all auth-related tokens from storage
 */
export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEYS.accessToken);
  localStorage.removeItem(TOKEN_KEYS.refreshToken);
  localStorage.removeItem(TOKEN_KEYS.expiresAt);
}

/**
 * Logout: clear tokens
 * Note: For redirect, use the useAuth() hook's logout() instead
 */
export function logout(): void {
  clearAuthTokens();
}

/**
 * Parse JWT payload
 */
export function parseJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwt<{ exp?: number }>(token);
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}
