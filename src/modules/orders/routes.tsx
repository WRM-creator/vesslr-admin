import type { RouteObject } from "react-router-dom";
import Orders from "./pages/orders";

export const orderRoutes: RouteObject[] = [
  {
    path: "orders",
    element: <Orders />,
  },
];
