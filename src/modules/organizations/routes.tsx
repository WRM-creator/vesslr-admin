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
      Component: (await import("./pages/organization-details")).default,
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
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationOverviewRoute,
        }),
      },
      {
        path: "team",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationTeamRoute,
        }),
      },
      {
        path: "products",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationProductsRoute,
        }),
      },
      {
        path: "compliance",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationComplianceRoute,
        }),
      },
      {
        path: "financials",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationFinancialsRoute,
        }),
      },
      {
        path: "transactions",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationTransactionsRoute,
        }),
      },
      {
        path: "disputes",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationDisputesRoute,
        }),
      },
    ],
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
      Component: (await import("./pages/organization-details")).default,
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
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationOverviewRoute,
        }),
      },
      {
        path: "team",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationTeamRoute,
        }),
      },
      {
        path: "products",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationProductsRoute,
        }),
      },
      {
        path: "compliance",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationComplianceRoute,
        }),
      },
      {
        path: "financials",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationFinancialsRoute,
        }),
      },
      {
        path: "transactions",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationTransactionsRoute,
        }),
      },
      {
        path: "disputes",
        lazy: async () => ({
          Component: (await import("./pages/organization-tabs-routes"))
            .OrganizationDisputesRoute,
        }),
      },
    ],
  },
];
