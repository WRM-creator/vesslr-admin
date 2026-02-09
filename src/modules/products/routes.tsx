import type { RouteObject } from "react-router-dom";

import ProductsPage from "./pages/products";

export const productsRoutes: RouteObject[] = [
  {
    path: "products",
    element: <ProductsPage />,
  },

  {
    path: "product-approvals",
    lazy: async () => ({
      Component: (await import("./pages/product-approvals")).default,
    }),
  },
  {
    path: "products/:id",
    lazy: async () => ({
      Component: (await import("./pages/product-details")).default,
    }),
  },
];
