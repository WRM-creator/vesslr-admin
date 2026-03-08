import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { ArrowLeft, Building2, RefreshCw, Tag } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ApproveProductDialog } from "../components/product-details/approve-product-dialog";
import { DelistProductDialog } from "../components/product-details/delist-product-dialog";
import { ProductOverviewTab } from "../components/product-details/product-overview-tab";
import { RejectProductDialog } from "../components/product-details/reject-product-dialog";

const STATUS_VARIANT = {
  approved: "success",
  rejected: "danger",
  pending: "warning",
  delisted: "neutral",
} as const;

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<
    "approve" | "reject" | "delist" | null
  >(null);

  const { data, isLoading, error } = api.admin.products.detail.useQuery({
    path: { id: id! },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = (data as any)?.data ?? data;

  const { mutate: updateProduct, isPending } =
    api.admin.products.update.useMutation();

  useAppBreadcrumbLabel(id!, product?.title);

  const handleApprove = () => {
    updateProduct(
      { path: { id: id! }, body: { status: "approved" } },
      {
        onSuccess: () => {
          toast.success("Product approved");
          setActiveAction(null);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (e: any) =>
          toast.error(e.message || "Failed to approve product"),
      },
    );
  };

  const handleReject = (reason: string) => {
    updateProduct(
      {
        path: { id: id! },
        body: { status: "rejected", rejectionReason: reason },
      },
      {
        onSuccess: () => {
          toast.success("Product rejected");
          setActiveAction(null);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (e: any) =>
          toast.error(e.message || "Failed to reject product"),
      },
    );
  };

  const handleDelist = (reason: string) => {
    updateProduct(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {
        path: { id: id! },
        body: {
          status: "delisted" as any,
          ...(reason && { delistReason: reason as any }),
        },
      },
      {
        onSuccess: () => {
          toast.success("Product delisted");
          setActiveAction(null);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (e: any) =>
          toast.error(e.message || "Failed to delist product"),
      },
    );
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex h-full min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      </Page>
    );
  }

  if (error || !product) {
    return (
      <Page>
        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold">Product not found</h2>
          <Button variant="outline" onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </Page>
    );
  }

  const status = product.status ?? "pending";

  return (
    <Page>
      <PageHeader
        title={product.title || "Untitled Product"}
        endContent={
          <div className="flex items-center gap-3">
            <StatusBadge
              status={status}
              variant={
                STATUS_VARIANT[status as keyof typeof STATUS_VARIANT] ??
                "neutral"
              }
            />
            {(status === "pending" || status === "rejected") && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveAction("reject")}
                  disabled={isPending}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => setActiveAction("approve")}
                  disabled={isPending}
                >
                  Approve
                </Button>
              </>
            )}
            {status === "approved" && (
              <Button
                size="sm"
                variant="destructive-outline"
                onClick={() => setActiveAction("delist")}
                disabled={isPending}
              >
                Delist
              </Button>
            )}
            {status === "delisted" && (
              <Button
                size="sm"
                onClick={() => setActiveAction("approve")}
                disabled={isPending}
              >
                Re-approve
              </Button>
            )}
          </div>
        }
      />

      {/* Summary strip */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-5">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-28 w-28 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex h-28 w-28 shrink-0 items-center justify-center rounded-lg text-xs">
                No image
              </div>
            )}
            <div className="flex flex-col justify-center gap-3">
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-xs">
                    Price per unit
                  </p>
                  <p className="text-sm font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: product.currency || "USD",
                    }).format(product.pricePerUnit)}
                  </p>
                </div>
                {product.organization?.name && (
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground text-xs">Merchant</p>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <Building2 className="text-muted-foreground h-3.5 w-3.5" />
                      {product.organization.name}
                    </p>
                  </div>
                )}
                {product.category?.name && (
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground text-xs">Category</p>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <Tag className="text-muted-foreground h-3.5 w-3.5" />
                      {product.category.name}
                    </p>
                  </div>
                )}
                {product.createdAt && (
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground text-xs">Submitted</p>
                    <p className="text-sm font-medium">
                      {format(new Date(product.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>
              {product.displayId && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <p className="text-muted-foreground text-xs">
                      Display ID: #{product.displayId}
                    </p>
                    {product.resubmissionCount > 0 && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <RefreshCw className="h-3 w-3" />
                        Resubmission #{product.resubmissionCount}
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductOverviewTab product={product} />

      <ApproveProductDialog
        open={activeAction === "approve"}
        onOpenChange={(open) => !open && setActiveAction(null)}
        onConfirm={handleApprove}
        isSubmitting={isPending}
      />
      <RejectProductDialog
        open={activeAction === "reject"}
        onOpenChange={(open) => !open && setActiveAction(null)}
        onConfirm={handleReject}
        isSubmitting={isPending}
      />
      <DelistProductDialog
        open={activeAction === "delist"}
        onOpenChange={(open) => !open && setActiveAction(null)}
        onConfirm={handleDelist}
        isSubmitting={isPending}
      />
    </Page>
  );
}
