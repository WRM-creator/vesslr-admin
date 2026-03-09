import type { RouteObject } from "react-router-dom";
import Categories from "./pages/categories";
import CategoryGroupDetailsPage from "./pages/category-group-details";

export const categoryRoutes: RouteObject[] = [
  {
    path: "categories",
    element: <Categories />,
  },
  {
    path: "categories/:id",
    element: <CategoryGroupDetailsPage />,
  },
];
