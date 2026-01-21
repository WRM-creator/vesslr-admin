import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { ProductsTable } from "../components/products-table";
import { MOCK_PRODUCTS } from "../lib/product-model";

export default function ProductsPage() {
  return (
    <Page>
      <PageHeader
        title="Products"
        description="Manage your product inventory."
      />
      <ProductsTable data={MOCK_PRODUCTS} />
    </Page>
  );
}
