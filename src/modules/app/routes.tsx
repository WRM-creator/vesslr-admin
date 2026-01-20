import { Navigate, type RouteObject } from "react-router-dom";
import { AuthGuard } from "@/guards/auth-guard";
import AppLayout from "./_layout";

import { dashboardRoutes } from "../dashboard/routes";
import { categoryRoutes } from "../categories/routes";
// Removed unused module imports

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...dashboardRoutes,
          ...categoryRoutes,
        ],
      },
    ],
  },
];
