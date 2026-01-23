import type { RouteObject } from "react-router-dom";
import DisputeDetailsPage from "./pages/dispute-details";
import DisputesPage from "./pages/disputes";

export const disputesRoutes: RouteObject[] = [
  {
    path: "disputes",
    element: <DisputesPage />,
  },
  {
    path: "disputes/:id",
    element: <DisputeDetailsPage />,
  },
];
