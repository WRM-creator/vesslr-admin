import type { RouteObject } from "react-router-dom";

export const organizationsRoutes: RouteObject[] = [
  {
    path: "merchants",
    lazy: async () => ({
      Component: (await import("./pages/merchants")).default,
    }),
  },
  {
    path: "customers",
    lazy: async () => ({
      Component: (await import("./pages/customers")).default,
    }),
  },
  {
    path: "customers/:id",
    lazy: async () => ({
      Component: (await import("./pages/customer-details")).default,
    }),
  },
  {
    path: "registrations",
    lazy: async () => ({
      Component: (await import("./pages/registrations")).default,
    }),
  },
  {
    path: "merchants/:id",
    lazy: async () => ({
      Component: (await import("./pages/merchant-details")).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => {
          const { Navigate } = await import("react-router-dom");
          return { Component: () => <Navigate to="overview" replace /> };
        },
      },
      {
        path: "overview",
        lazy: async () => ({
          Component: (await import("./pages/merchant-tabs-routes"))
            .MerchantOverviewRoute,
        }),
      },
      {
        path: "team",
        lazy: async () => ({
          Component: (await import("./pages/merchant-tabs-routes"))
            .MerchantTeamRoute,
        }),
      },
      {
        path: "products",
        lazy: async () => ({
          Component: (await import("./pages/merchant-tabs-routes"))
            .MerchantProductsRoute,
        }),
      },
      {
        path: "compliance",
        lazy: async () => ({
          Component: (await import("./pages/merchant-tabs-routes"))
            .MerchantComplianceRoute,
        }),
      },
      {
        path: "financials",
        lazy: async () => ({
          Component: (await import("./pages/merchant-tabs-routes"))
            .MerchantFinancialsRoute,
        }),
      },
      {
        path: "transactions",
        lazy: async () => ({
          Component: (await import("./pages/merchant-tabs-routes"))
            .MerchantTransactionsRoute,
        }),
      },
      {
        path: "disputes",
        lazy: async () => ({
          Component: (await import("./pages/merchant-tabs-routes"))
            .MerchantDisputesRoute,
        }),
      },
    ],
  },
];
