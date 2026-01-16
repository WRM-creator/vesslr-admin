import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/data-table";
import { productColumns, type Product } from "./columns";

interface ProductsTableProps {
  data: Product[];
  isLoading?: boolean;
}

export function ProductsTable({ data, isLoading = false }: ProductsTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      columns={productColumns}
      data={data}
      isLoading={isLoading}
      onRowClick={(row) => navigate(`/products/${row.original._id}`)}
      emptyContent={
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      }
    />
  );
}
