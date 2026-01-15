import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken?: string,
    expiresAt?: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEYS = {
  accessToken: "admin_auth_token",
  refreshToken: "admin_refresh_token",
  expiresAt: "admin_expires_at",
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize from localStorage
    return !!localStorage.getItem(TOKEN_KEYS.accessToken);
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.accessToken);
    const expiresAt = localStorage.getItem(TOKEN_KEYS.expiresAt);

    if (token) {
      // Check if token is expired
      if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        if (expiryDate <= new Date()) {
          // Token expired, clear and set as not authenticated
          logout();
          return;
        }
      }
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (
    accessToken: string,
    refreshToken?: string,
    expiresAt?: string
  ) => {
    localStorage.setItem(TOKEN_KEYS.accessToken, accessToken);
    if (refreshToken) {
      localStorage.setItem(TOKEN_KEYS.refreshToken, refreshToken);
    }
    if (expiresAt) {
      localStorage.setItem(TOKEN_KEYS.expiresAt, expiresAt);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEYS.accessToken);
    localStorage.removeItem(TOKEN_KEYS.refreshToken);
    localStorage.removeItem(TOKEN_KEYS.expiresAt);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
