import type { RouteObject } from "react-router-dom";

export const routingRoutes: RouteObject[] = [
  {
    path: "routing",
    lazy: async () => ({
      Component: (await import("./pages/routing-rules")).default,
    }),
  },
];
