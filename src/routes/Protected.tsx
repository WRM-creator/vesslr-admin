// src/routes/Protected.tsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { getToken, isExpired } from "@/lib/auth";

export default function Protected() {
  const location = useLocation();
  const token = getToken();
  const valid = !!token && !isExpired(token);

  if (!valid) {
    return (
      <Navigate
        to="/admin/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return <Outlet />;
}
