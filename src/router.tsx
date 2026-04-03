import { createBrowserRouter, Navigate } from "react-router-dom";
import { NotFoundPage } from "./components/not-found-page";
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
    element: <NotFoundPage />,
  },
]);
