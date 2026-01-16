import { createBrowserRouter, Navigate } from "react-router-dom";
import { authRoutes } from "./modules/auth/routes";
import { appRoutes } from "./modules/app/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  ...authRoutes,
  ...appRoutes,
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
