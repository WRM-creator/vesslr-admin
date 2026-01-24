import type { RouteObject } from "react-router-dom";
import Categories from "./pages/categories";
import CategoryDetails from "./pages/category-details";
import NewCategory from "./pages/new-category";

export const categoryRoutes: RouteObject[] = [
  {
    path: "categories",
    element: <Categories />,
  },
  {
    path: "categories/new",
    element: <NewCategory />,
  },
  {
    path: "categories/:id",
    element: <CategoryDetails />,
  },
];
