import { Navigate, type RouteObject } from "react-router-dom";
import { AuthGuard } from "@/guards/auth-guard";
import AppLayout from "./_layout";

import { dashboardRoutes } from "../dashboard/routes";
import { adminRoutes } from "../admins/routes";
import { usersRoutes } from "../users/routes";
import { productRoutes } from "../products/routes";
import { orderRoutes } from "../orders/routes";
import { categoryRoutes } from "../categories/routes";
import { settingsRoutes } from "../settings/routes";

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
          ...adminRoutes,
          ...usersRoutes,
          ...productRoutes,
          ...orderRoutes,
          ...categoryRoutes,
          ...settingsRoutes,
        ],
      },
    ],
  },
];
