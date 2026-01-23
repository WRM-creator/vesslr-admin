import type { RouteObject } from "react-router-dom";

export const merchantsRoutes: RouteObject[] = [
  {
    path: "merchants",
    lazy: async () => ({
      Component: (await import("./pages/merchants-page")).default,
    }),
  },
  {
    path: "merchants/:id",
    lazy: async () => ({
      Component: (await import("./pages/merchant-details")).default,
    }),
  },
];
