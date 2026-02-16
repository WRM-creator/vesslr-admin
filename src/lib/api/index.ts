/**
 * Central API Export
 *
 * This is the ONLY file you should import from for API calls.
 * All SDK functions are wrapped with React Query factories for
 * automatic caching, type inference, and optimistic updates.
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const { data } = api.products.list.useSuspenseQuery({});
 */

import { createMutation, createQuery } from "./factory";

// Import client config to initialize interceptors
import "./client-config";

// Import generated SDK functions as needed
// NOTE: These imports will be available after running `npm run generate:api`
// Uncomment and add imports as you need them:
//
import {
  adminAuthControllerGetProfile,
  adminAuthControllerLogin,
  adminAuthControllerVerifyOtp,
  adminCategoriesControllerCreate,
  adminCategoriesControllerFindAll,
  adminCategoriesControllerFindOne,
  adminCategoriesControllerRemove,
  adminCategoriesControllerUpdate,
  adminNegotiationsControllerFindAll,
  adminNegotiationsControllerFindOne,
  adminNegotiationsControllerUpdateStatus,
  adminOrganizationsControllerFindAll,
  adminProductsControllerCreate,
  adminProductsControllerFindAll,
  adminProductsControllerFindOne,
  adminProductsControllerRemove,
  adminProductsControllerUpdate,
  adminRequestsControllerAcceptRequest,
  adminRequestsControllerFindAll,
  adminRequestsControllerFindOne,
  adminRequestsControllerUpdateStatus,
  adminTransactionsControllerAddDocument,
  adminTransactionsControllerDeleteRequirement,
  adminTransactionsControllerFindAll,
  adminTransactionsControllerFindById,
  adminTransactionsControllerGetLogs,
  adminTransactionsControllerReviewDocument,
  adminTransactionsControllerUpdateRequirement,
  productsControllerFindAll,
  productsControllerFindOne,
} from "./generated";

export const api = {
  auth: {
    login: createMutation(adminAuthControllerLogin),
    verifyOtp: createMutation(adminAuthControllerVerifyOtp),
    profile: createQuery(adminAuthControllerGetProfile, ["auth", "profile"]),
  },
  admin: {
    transactions: {
      list: createQuery(adminTransactionsControllerFindAll, (args) => [
        "admin",
        "transactions",
        "list",
        args?.query,
      ]),
      detail: createQuery(adminTransactionsControllerFindById, (args) => [
        "admin",
        "transactions",
        "detail",
        args.path.id,
      ]),
      addDocument: createMutation(adminTransactionsControllerAddDocument, {
        invalidates: (args) => [
          ["admin", "transactions", "detail", args.path.id],
        ],
      }),
      updateRequirement: createMutation(
        adminTransactionsControllerUpdateRequirement,
        {
          invalidates: (args) => [
            ["admin", "transactions", "detail", args.path.id],
          ],
        },
      ),
      deleteRequirement: createMutation(
        adminTransactionsControllerDeleteRequirement,
        {
          invalidates: (args) => [
            ["admin", "transactions", "detail", args.path.id],
          ],
        },
      ),
      reviewDocument: createMutation(
        adminTransactionsControllerReviewDocument,
        {
          invalidates: (args) => [
            ["admin", "transactions", "detail", args.path.id],
          ],
        },
      ),
      logs: createQuery(adminTransactionsControllerGetLogs, (args) => [
        "admin",
        "transactions",
        "logs",
        args.path.id,
      ]),
    },
    products: {
      create: createMutation(adminProductsControllerCreate, {
        invalidates: () => [["admin", "products", "list"]],
      }),
      update: createMutation(adminProductsControllerUpdate, {
        invalidates: (args) => [
          ["admin", "products", "list"],
          ["admin", "products", "detail", args.path.id],
        ],
      }),
      remove: createMutation(adminProductsControllerRemove, {
        invalidates: () => [["admin", "products", "list"]],
      }),
      list: createQuery(adminProductsControllerFindAll, (args) => [
        "admin",
        "products",
        "list",
        args?.query,
      ]),
      detail: createQuery(adminProductsControllerFindOne, (args) => [
        "admin",
        "products",
        "detail",
        args.path.id,
      ]),
    },
    organizations: {
      list: createQuery(adminOrganizationsControllerFindAll, (args) => [
        "admin",
        "organizations",
        "list",
        args?.query,
      ]),
      detail: createQuery(adminRequestsControllerFindOne, (args) => [
        "admin",
        "requests",
        "detail",
        args.path.id,
      ]),
    },
    requests: {
      list: createQuery(adminRequestsControllerFindAll, (args) => [
        "admin",
        "requests",
        "list",
        args?.query,
      ]),
      detail: createQuery(adminRequestsControllerFindOne, (args) => [
        "admin",
        "requests",
        "detail",
        args.path.id,
      ]),
      updateStatus: createMutation(adminRequestsControllerUpdateStatus, {
        invalidates: (args) => [
          ["admin", "requests", "list"],
          ["admin", "requests", "detail", args.path.id],
        ],
      }),
      accept: createMutation(adminRequestsControllerAcceptRequest, {
        invalidates: (args) => [
          ["admin", "requests", "list"],
          ["admin", "requests", "detail", args.path.id],
        ],
      }),
    },
    negotiations: {
      list: createQuery(adminNegotiationsControllerFindAll, (args) => [
        "admin",
        "negotiations",
        "list",
        args?.query,
      ]),
      detail: createQuery(adminNegotiationsControllerFindOne, (args) => [
        "admin",
        "negotiations",
        "detail",
        args.path.id,
      ]),
      updateStatus: createMutation(adminNegotiationsControllerUpdateStatus, {
        invalidates: (args) => [
          ["admin", "negotiations", "list"],
          ["admin", "negotiations", "detail", args.path.id],
        ],
      }),
    },
  },
  products: {
    list: createQuery(productsControllerFindAll, (args) => [
      "products",
      "list",
      args?.query,
    ]),
    detail: createQuery(productsControllerFindOne, (args) => [
      "products",
      "detail",
      args.path.id,
    ]),
  },
  organizations: {
    list: createQuery(adminOrganizationsControllerFindAll, (args) => [
      "organizations",
      "list",
      args?.query,
    ]),
  },
  categories: {
    list: createQuery(adminCategoriesControllerFindAll, ["categories", "list"]),
    detail: createQuery(adminCategoriesControllerFindOne, (args) => [
      "categories",
      "detail",
      args.path.id,
    ]),
    create: createMutation(adminCategoriesControllerCreate, {
      invalidates: () => [["categories", "list"]],
    }),
    update: createMutation(adminCategoriesControllerUpdate, {
      invalidates: (args) => [
        ["categories", "list"],
        ["categories", "detail", args.path.id],
      ],
    }),
    delete: createMutation(adminCategoriesControllerRemove, {
      invalidates: () => [["categories", "list"]],
    }),
  },
  // organizations: {
  //   list: createQuery(getApiV1AdminOrganizations, ["organizations", "list"]),
  //   detail: createQuery(getApiV1AdminOrganizationsById, [
  //     "organizations",
  //     "detail",
  //   ]),
  //   create: createMutation(postApiV1AdminOrganizations, {
  //     invalidates: () => [["organizations", "list"]],
  //   }),
  //   update: createMutation(putApiV1AdminOrganizationsById, {
  //     invalidates: () => [["organizations", "list"]],
  //   }),
  //   delete: createMutation(deleteApiV1AdminOrganizationsById, {
  //     invalidates: () => [["organizations", "list"]],
  //   }),
  // },
  // products: {
  //   list: createQuery(getApiV1Products, ["products", "list"]),
  //   detail: createQuery(getApiV1ProductsById, ["products", "detail"]),
  //   update: createMutation(putApiV1ProductsById, {
  //     invalidates: () => [
  //       ["products", "list"],
  //       ["products", "detail"],
  //     ],
  //   }),
  //   updateStatus: createMutation(patchApiV1ProductsByIdStatus, {
  //     invalidates: () => [
  //       ["products", "list"],
  //       ["products", "detail"],
  //     ],
  //   }),
  // },
  // vendors: {
  //   detail: createQuery(getApiV1VendorsById, ["vendors", "detail"]),
  //   payments: {
  //     list: createQuery(getApiV1VendorsByIdPayments, [
  //       "vendors",
  //       "payments",
  //       "list",
  //     ]),
  //     create: createMutation(postApiV1VendorsByIdPayments, {
  //       invalidates: () => [["vendors", "payments", "list"]],
  //     }),
  //   },
  // },
};

// Re-export factory utilities for advanced usage
export {
  createMutation,
  createQuery,
  shallowMergeApiResponse,
} from "./factory";
export type {
  ApiResponse,
  MutationConfig,
  OptimisticUpdateConfig,
} from "./factory";

export { clearAuthTokens, getAuthToken, isAuthenticated, logout } from "./auth";
