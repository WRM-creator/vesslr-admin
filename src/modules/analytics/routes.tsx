import type { RouteObject } from "react-router-dom";

export const analyticsRoutes: RouteObject[] = [
  {
    path: "analytics",
    lazy: async () => ({
      Component: (await import("./pages/analytics")).default,
    }),
  },
];
