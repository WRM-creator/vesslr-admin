import { NotFoundPage } from "@/components/not-found-page";
import { AuthGuard } from "@/guards/auth-guard";
import { Navigate, type RouteObject } from "react-router-dom";
import AppLayout from "./_layout";
import { AppErrorBoundary } from "./error-boundary";

import { analyticsRoutes } from "../analytics/routes";
import { categoryRoutes } from "../categories/routes";
import { dashboardRoutes } from "../dashboard/routes";
import { disputesRoutes } from "../disputes/routes";
import { escrowsRoutes } from "../escrows/routes";
import { ledgerRoutes } from "../ledger/routes";
import { logisticsRoutes } from "../logistics/routes";
import { organizationsRoutes } from "../organizations/routes";
import { supportRoutes } from "../support/routes";
import { productsRoutes } from "../products/routes";
import { requestsRoutes } from "../requests/routes";
import { settingsRoutes } from "../settings/routes";
import { transactionRoutes } from "../transactions/routes";
import { cmsRoutes } from "../cms/routes";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthGuard />,
    errorElement: <AppErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...dashboardRoutes,
          ...requestsRoutes,
          ...categoryRoutes,
          ...transactionRoutes,
          ...organizationsRoutes,
          ...productsRoutes,
          ...escrowsRoutes,
          ...ledgerRoutes,
          ...disputesRoutes,
          ...supportRoutes,
          ...logisticsRoutes,
          ...analyticsRoutes,
          ...cmsRoutes,
          ...settingsRoutes,
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
];
