import type { RouteObject } from "react-router-dom";
import Categories from "./pages/categories";
import CategoryDetails from "./pages/category-details";

export const categoryRoutes: RouteObject[] = [
  {
    path: "categories",
    element: <Categories />,
  },
  {
    path: "categories/:id",
    element: <CategoryDetails />,
  },
];
