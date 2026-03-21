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
import {
  adminDisputesControllerCreateRequest,
  adminDisputesControllerDismissRequest,
} from "./disputes";
import { adminTransactionsControllerGetConversation } from "./transaction-conversations";

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
  adminComplianceControllerGetCase,
  adminLedgerControllerGetAccount,
  adminLedgerControllerGetStatement,
  adminComplianceControllerReviewKyb,
  adminComplianceControllerReviewKyc,
  adminDisputesControllerFindAll,
  adminDisputesControllerFindOne,
  adminDisputesControllerGetStats,
  adminDisputesControllerResolve,
  adminOrganizationsControllerListMembers,
  adminNegotiationsControllerFindAll,
  adminNegotiationsControllerFindOne,
  adminNegotiationsControllerUpdateStatus,
  adminOrganizationsControllerFindAll,
  adminOrganizationsControllerFindOne,
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
  adminTransactionsControllerReviewInspection,
  adminTransactionsControllerSubmitInspection,
  adminTransactionsControllerUpdateRequirement,
  categoryGroupsControllerFindAll,
  categoryGroupsControllerFindOne,
  categoryGroupsControllerUpdate,
  productsControllerFindAll,
  productsControllerFindOne,
  storageControllerGeneratePresignedUrls,
  adminDashboardControllerGetStats,
} from "./generated";

export const api = {
  auth: {
    login: createMutation(adminAuthControllerLogin),
    verifyOtp: createMutation(adminAuthControllerVerifyOtp),
    profile: createQuery(adminAuthControllerGetProfile, ["auth", "profile"]),
  },
  admin: {
    dashboard: {
      stats: createQuery(adminDashboardControllerGetStats, [
        "admin",
        "dashboard",
        "stats",
      ]),
    },
    disputes: {
      list: createQuery(adminDisputesControllerFindAll, (args) => [
        "admin",
        "disputes",
        "list",
        args?.query,
      ]),
      detail: createQuery(adminDisputesControllerFindOne, (args) => [
        "admin",
        "disputes",
        "detail",
        args.path.id,
      ]),
      resolve: createMutation(adminDisputesControllerResolve, {
        invalidates: (args) => [
          ["admin", "disputes", "list"],
          ["admin", "disputes", "detail", args.path.id],
        ],
      }),
      stats: createQuery(adminDisputesControllerGetStats, [
        "admin",
        "disputes",
        "stats",
      ]),
      createRequest: createMutation(adminDisputesControllerCreateRequest, {
        invalidates: (args) => [
          ["admin", "disputes", "list"],
          ["admin", "disputes", "detail", args.path.id],
        ],
      }),
      dismissRequest: createMutation(adminDisputesControllerDismissRequest, {
        invalidates: (args) => [
          ["admin", "disputes", "list"],
          ["admin", "disputes", "detail", args.path.id],
        ],
      }),
    },
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
      submitInspection: createMutation(
        adminTransactionsControllerSubmitInspection,
        {
          invalidates: (args) => [
            ["admin", "transactions", "detail", args.path.id],
          ],
        },
      ),
      reviewInspection: createMutation(
        adminTransactionsControllerReviewInspection,
        {
          invalidates: (args) => [
            ["admin", "transactions", "detail", args.path.id],
          ],
        },
      ),
      conversation: createQuery(
        adminTransactionsControllerGetConversation,
        (args) => ["admin", "transactions", "conversation", args.path.id],
      ),
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
      detail: createQuery(adminOrganizationsControllerFindOne, (args) => [
        "admin",
        "organizations",
        "detail",
        args.path.id,
      ]),
      members: createQuery(adminOrganizationsControllerListMembers, (args) => [
        "admin",
        "organizations",
        "members",
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
    ledger: {
      account: createQuery(adminLedgerControllerGetAccount, (args) => [
        "admin",
        "ledger",
        "account",
        args.path.code,
      ]),
      statement: createQuery(adminLedgerControllerGetStatement, (args) => [
        "admin",
        "ledger",
        "statement",
        args.path.code,
        args?.query,
      ]),
    },
    compliance: {
      getCase: createQuery(adminComplianceControllerGetCase, (args) => [
        "admin",
        "compliance",
        "case",
        args.path.organizationId,
      ]),
      reviewKyb: createMutation(adminComplianceControllerReviewKyb, {
        invalidates: (args) => [
          ["admin", "compliance", "case", args.path.organizationId],
        ],
      }),
      reviewKyc: createMutation(adminComplianceControllerReviewKyc, {
        invalidates: (args) => [["admin", "compliance", "case"]],
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
    detail: createQuery(adminOrganizationsControllerFindOne, (args) => [
      "organizations",
      "detail",
      args.path.id,
    ]),
  },
  categories: {
    list: createQuery(adminCategoriesControllerFindAll, (args) => [
      "categories",
      "list",
      args?.query?.groupId,
    ]),
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
  categoryGroups: {
    findAll: createQuery(categoryGroupsControllerFindAll, [
      "categoryGroups",
      "findAll",
    ]),
    detail: createQuery(categoryGroupsControllerFindOne, (args) => [
      "categoryGroups",
      "detail",
      args.path.id,
    ]),
    update: createMutation(categoryGroupsControllerUpdate, {
      invalidates: (args) => [
        ["categoryGroups", "detail", args.path.id],
        ["categoryGroups", "findAll"],
      ],
    }),
  },
  storage: {
    presignedUrls: createMutation(storageControllerGeneratePresignedUrls),
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
