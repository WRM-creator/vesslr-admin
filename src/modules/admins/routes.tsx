import type { RouteObject } from "react-router-dom";
import Admins from "./pages/admins";

export const adminRoutes: RouteObject[] = [
  {
    path: "admins",
    element: <Admins />,
  },
];
