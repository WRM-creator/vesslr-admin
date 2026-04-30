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
  {
    path: "categories/:groupId/new",
    lazy: async () => ({
      Component: (await import("./pages/category-editor")).default,
    }),
  },
  {
    path: "categories/:groupId/:id/edit",
    lazy: async () => ({
      Component: (await import("./pages/category-editor")).default,
    }),
  },
];
