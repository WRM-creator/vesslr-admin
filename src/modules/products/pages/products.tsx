import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { ProductsTable } from "../components/products-table";
import type { Product } from "../components/products-table/columns";

export default function Products() {
  const { data, isLoading } = api.products.list.useQuery({});
  const products = (data?.data?.docs ?? []) as Product[];

  return (
    <div className="space-y-4">
      <PageHeader title="Products" />
      <ProductsTable data={products} isLoading={isLoading} />
    </div>
  );
}
