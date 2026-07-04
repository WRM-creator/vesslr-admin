import type { RouteObject } from "react-router-dom";

export const benchmarksRoutes: RouteObject[] = [
  {
    path: "benchmarks",
    lazy: async () => ({
      Component: (await import("./pages/benchmarks")).default,
    }),
  },
];
