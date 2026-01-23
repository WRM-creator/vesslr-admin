import type { RouteObject } from "react-router-dom";
import FulfillmentDetailsPage from "./pages/fulfillment-details";
import LogisticsPage from "./pages/logistics";

export const logisticsRoutes: RouteObject[] = [
  {
    path: "logistics",
    element: <LogisticsPage />,
  },
  {
    path: "logistics/:id",
    element: <FulfillmentDetailsPage />,
  },
];
