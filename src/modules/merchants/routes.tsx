import type { RouteObject } from "react-router-dom";
import MerchantsPage from "./pages/merchants-page";

export const merchantsRoutes: RouteObject[] = [
  {
    path: "merchants",
    element: <MerchantsPage />,
  },
];
