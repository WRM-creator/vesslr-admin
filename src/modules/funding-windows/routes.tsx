import type { RouteObject } from "react-router-dom";

export const fundingWindowsRoutes: RouteObject[] = [
  {
    path: "funding-windows",
    lazy: async () => ({
      Component: (await import("./pages/funding-windows")).default,
    }),
  },
];
