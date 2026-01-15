// src/routes/Protected.tsx
// DEPRECATED: Use ProtectedRoute.tsx instead
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { getAuthToken, isTokenExpired } from "@/lib/api/auth";

export default function Protected() {
  const location = useLocation();
  const token = getAuthToken();
  const valid = !!token && !isTokenExpired(token);

  if (!valid) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return <Outlet />;
}
