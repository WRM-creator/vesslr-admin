import { AuthGuard } from "@/guards/auth-guard";
import { Navigate, type RouteObject } from "react-router-dom";
import AppLayout from "./_layout";

import { categoryRoutes } from "../categories/routes";
import { dashboardRoutes } from "../dashboard/routes";
import { transactionRoutes } from "../transactions/routes";
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
          ...transactionRoutes,
        ],
      },
    ],
  },
];
