import type { RouteObject } from "react-router-dom";

import CmsPagesPage from "./pages/cms-pages";

export const cmsRoutes: RouteObject[] = [
  {
    path: "cms/pages",
    element: <CmsPagesPage />,
  },
  {
    path: "cms/pages/create",
    lazy: async () => ({
      Component: (await import("./pages/cms-page-editor")).default,
    }),
  },
  {
    path: "cms/pages/:id",
    lazy: async () => ({
      Component: (await import("./pages/cms-page-editor")).default,
    }),
  },
];
