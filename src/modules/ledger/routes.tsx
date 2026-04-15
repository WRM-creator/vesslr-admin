import type { RouteObject } from "react-router-dom";
import LedgerPage from "./pages/ledger";

export const ledgerRoutes: RouteObject[] = [
  {
    path: "ledger",
    element: <LedgerPage />,
  },
  {
    path: "ledger/accounts/:code",
    lazy: async () => ({
      Component: (await import("./pages/account-statement")).default,
    }),
  },
];
