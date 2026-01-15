import type { RouteObject } from "react-router-dom";
import Categories from "./pages/categories";

export const categoryRoutes: RouteObject[] = [
  {
    path: "categories",
    element: <Categories />,
  },
];
