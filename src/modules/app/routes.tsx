import { AuthGuard } from "@/guards/auth-guard";
import { Navigate, type RouteObject } from "react-router-dom";
import AppLayout from "./_layout";

import { analyticsRoutes } from "../analytics/routes";
import { categoryRoutes } from "../categories/routes";
import { dashboardRoutes } from "../dashboard/routes";
import { disputesRoutes } from "../disputes/routes";
import { escrowsRoutes } from "../escrows/routes";
import { logisticsRoutes } from "../logistics/routes";
import { organizationsRoutes } from "../organizations/routes";
import { productsRoutes } from "../products/routes";
import { transactionRoutes } from "../transactions/routes";

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
          ...organizationsRoutes,
          ...productsRoutes,
          ...escrowsRoutes,
          ...disputesRoutes,
          ...logisticsRoutes,
          ...analyticsRoutes,
        ],
      },
    ],
  },
];
