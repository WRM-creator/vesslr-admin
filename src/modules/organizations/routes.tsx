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
];
