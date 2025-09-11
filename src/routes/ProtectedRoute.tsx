// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";            // type-only import ✅
import { getToken, isExpired } from "@/lib/auth";

type Props = { children: ReactNode };              // ReactNode allows 1+ children

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const token = getToken();
  const valid = !!token && !isExpired(token);

  console.log(
    "[ProtectedRoute] hasToken?",
    !!token,
    "expired?",
    token ? isExpired(token) : "n/a"
  );

  if (!valid) {
    return (
      <Navigate
        to="/admin/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Return a single node even if multiple children were passed
  return <>{children}</>;
}
