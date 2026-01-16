import type { RouteObject } from "react-router-dom";
import Products from "./pages/products";
import ProductDetails from "./pages/product-details";

export const productRoutes: RouteObject[] = [
  {
    path: "products",
    element: <Products />,
  },
  {
    path: "products/:id",
    element: <ProductDetails />,
  },
];

