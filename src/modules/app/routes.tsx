import { AuthGuard } from "@/guards/auth-guard";
import { Navigate, type RouteObject } from "react-router-dom";
import AppLayout from "./_layout";

import { categoryRoutes } from "../categories/routes";
import { customersRoutes } from "../customers/routes";
import { dashboardRoutes } from "../dashboard/routes";
import { disputesRoutes } from "../disputes/routes";
import { escrowsRoutes } from "../escrows/routes";
import { merchantsRoutes } from "../merchants/routes";
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
          ...merchantsRoutes,
          ...customersRoutes,
          ...productsRoutes,
          ...escrowsRoutes,
          ...disputesRoutes,
        ],
      },
    ],
  },
];
