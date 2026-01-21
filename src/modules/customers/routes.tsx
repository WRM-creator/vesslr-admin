import type { RouteObject } from "react-router-dom";
import { CustomersPage } from "./pages/customers-page";

export const customersRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <CustomersPage />,
  },
  {
    path: "customers/:id",
    element: (
      <div>
        Customer Details Page (Access via ID:{" "}
        {window.location.pathname.split("/").pop()})
      </div>
    ), // Placeholder
  },
];
