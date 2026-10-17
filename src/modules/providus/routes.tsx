import type { RouteObject } from "react-router-dom";

export const providusRoutes: RouteObject[] = [
  {
    path: "providus-settlements",
    lazy: async () => ({
      Component: (await import("./pages/providus-settlements-list")).default,
    }),
  },
  {
    path: "providus-settlements/:id",
    lazy: async () => ({
      Component: (await import("./pages/providus-settlement-detail")).default,
    }),
  },
];
