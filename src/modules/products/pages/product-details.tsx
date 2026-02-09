import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ProductComplianceTab } from "../components/product-details/product-compliance-tab";
import { ProductOverviewTab } from "../components/product-details/product-overview-tab";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const { data, isLoading, error } = api.products.detail.useQuery({
    path: { id: id! },
  });

  const product = data?.data;

  useAppBreadcrumbLabel(id!, product?.title);

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      if (value === "overview") {
        prev.delete("tab");
      } else {
        prev.set("tab", value);
      }
      return prev;
    });
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

  return (
    <Page>
      <PageHeader
        title={product.title || "Untitled Product"}
        description={`Product ID: ${product._id}`}
      />

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ProductOverviewTab product={product} />
        </TabsContent>
        <TabsContent value="compliance" className="space-y-4">
          <ProductComplianceTab product={product} />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
