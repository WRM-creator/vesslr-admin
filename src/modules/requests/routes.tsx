import type { RouteObject } from "react-router-dom";
import RequestsDetailsPage from "./pages/request-details";
import RequestsPage from "./pages/requests";

export const requestsRoutes: RouteObject[] = [
  {
    path: "requests",
    element: <RequestsPage />,
  },
  {
    path: "requests/:id",
    element: <RequestsDetailsPage />,
  },
];
