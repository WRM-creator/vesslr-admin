import type { RouteObject } from "react-router-dom";
import DisputesPage from "./pages/disputes";

export const disputesRoutes: RouteObject[] = [
  {
    path: "disputes",
    element: <DisputesPage />,
  },
];
