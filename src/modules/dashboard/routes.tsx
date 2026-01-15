import type { RouteObject } from "react-router-dom";
import Dashboard from "./pages/dashboard";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
];
