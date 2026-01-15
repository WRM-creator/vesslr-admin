import type { RouteObject } from "react-router-dom";
import Users from "./pages/users";

export const usersRoutes: RouteObject[] = [
  {
    path: "users",
    element: <Users />,
  },
];
