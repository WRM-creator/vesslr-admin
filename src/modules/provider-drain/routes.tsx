import type { RouteObject } from "react-router-dom";

export const providerDrainRoutes: RouteObject[] = [
  {
    path: "provider-drain",
    lazy: async () => ({
      Component: (await import("./pages/provider-drain-list")).default,
    }),
  },
  {
    path: "provider-drain/:drainId",
    lazy: async () => ({
      Component: (await import("./pages/provider-drain-detail")).default,
    }),
  },
];
