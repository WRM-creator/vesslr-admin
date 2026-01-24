import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ArrowLeft, Check, Edit2, FileText, Flag, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_PRODUCT_DETAILS } from "../lib/product-details-model";

// Components
import { CategoryComplianceCard } from "../components/category-compliance-card";
import { MerchantInfoCard } from "../components/merchant-info-card";
import { ProductActivityCard } from "../components/product-activity-card";
import { ProductAdminNotesCard } from "../components/product-admin-notes-card";
import { ProductDetailsCard } from "../components/product-details-card";
import { ProductLogisticsCard } from "../components/product-logistics-card";
import { ProductOverviewCard } from "../components/product-overview-card";
import { ProductTransactionHistoryCard } from "../components/product-transaction-history-card";
import type { ProductDetails } from "../lib/product-details-model";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading } = api.products.detail.useQuery({
    path: { id: id! },
  });

  const { mutate: updateProduct, isPending } =
    api.products.update.useMutation();

  const product = (productData as any)?.data;
  // Fallback to mock if API returns nothing (or during dev), but ideally we map API -> UI model
  // For now, we mix the API data into the Mock structure to populate the UI without breaking it
  // In a real app, we'd have a proper mapper
  const data: ProductDetails = product
    ? {
        ...MOCK_PRODUCT_DETAILS,
        id: product._id,
        overview: {
          name: product.name,
          images: product.images || [],
          thumbnail: product.thumbnail || product.images?.[0] || "",
          status: product.status as any, // Cast to match UI model if needed
          transactionType: MOCK_PRODUCT_DETAILS.overview.transactionType, // Fallback for missing API fields
          price: product.price,
          currency: product.currency,
          created: product.created,
          lastUpdated: product.created,
        },
        merchant: {
          ...MOCK_PRODUCT_DETAILS.merchant,
          id: product.seller, // Assuming seller ID is returned
        },
      }
    : MOCK_PRODUCT_DETAILS;

  const isPendingApproval = data.overview.status === "pending_approval";

  const handleApprove = () => {
    if (!id) return;
    updateProduct(
      {
        path: { id },
        body: { status: "active" },
      },
      {
        onSuccess: () => {
          navigate("/product-approvals");
        },
      },
    );
  };

  const handleReject = () => {
    if (!id) return;
    updateProduct(
      {
        path: { id },
        body: { status: "draft" },
      },
      {
        onSuccess: () => {
          navigate("/product-approvals");
        },
      },
    );
  };

  return (
    <Page>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() =>
            navigate(isPendingApproval ? "/product-approvals" : "/products")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isPendingApproval ? "Back to Approvals" : "Back to Products"}
        </Button>
      </div>

      {isPendingApproval && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Pending Approval
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This product requires admin verification before it can be
                listed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive" onClick={handleReject}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleApprove}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageHeader
          title="Product Details"
          description={`Product ID: ${data.id}`}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Validate Compliance
          </Button>
          <Button variant="outline">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* KPI Highlights */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Inventory Status
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {data.specs.inventory.available}
              </span>
              <span className="text-muted-foreground text-sm">
                available / {data.specs.inventory.total}
              </span>
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Total Transactions
            </div>
            <div className="mt-2 text-2xl font-bold">
              {data.transactions.totalCount}
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Active Escrows
            </div>
            <div className="mt-2 text-2xl font-bold">
              {
                data.transactions.history.filter((t) => t.status === "active")
                  .length
              }
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Risk Level
            </div>
            <div className="mt-2 text-2xl font-bold">
              {data.admin.riskScore < 30 ? "Low" : "High"}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Main Info) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Overview / Identity */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Product Overview</h3>
              </div>
              <div className="p-6">
                <ProductOverviewCard data={data.overview} />
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Specifications & Inventory</h3>
              </div>
              <div className="p-6">
                <ProductDetailsCard data={data.specs} />
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Compliance & Category</h3>
              </div>
              <div className="p-6">
                <CategoryComplianceCard data={data.compliance} />
              </div>
            </div>

            {/* Logistics (Conditional) */}
            {data.logistics && (
              <div className="bg-card rounded-xl border shadow-sm">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h3 className="font-semibold">Live Logistics & Tracking</h3>
                  <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
                </div>
                <div className="p-6">
                  <ProductLogisticsCard data={data.logistics} />
                </div>
              </div>
            )}

            {/* Transaction History */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Transaction History</h3>
              </div>
              <div className="p-6">
                <ProductTransactionHistoryCard data={data.transactions} />
              </div>
            </div>
          </div>

          {/* Right Column (Merchant, Activity, Admin) */}
          <div className="space-y-6">
            {/* Merchant Info */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Listed By</h3>
              </div>
              <div className="p-6">
                <MerchantInfoCard data={data.merchant} />
              </div>
            </div>

            {/* Activity & Signals */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Activity & Signals</h3>
              </div>
              <div className="p-6">
                <ProductActivityCard data={data.activity} />
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-card rounded-xl border border-amber-200 shadow-sm dark:border-amber-900/50">
              <div className="border-b border-amber-200 bg-amber-50/50 px-6 py-4 dark:border-amber-900/50 dark:bg-amber-900/10">
                <h3 className="font-semibold text-amber-900 dark:text-amber-500">
                  Internal Admin Notes
                </h3>
              </div>
              <div className="p-6">
                <ProductAdminNotesCard data={data.admin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
