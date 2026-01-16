import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/shared/data-table";
import { categoryColumns, type Category } from "./columns";

interface CategoriesTableProps {
  data: Category[];
  isLoading?: boolean;
}

export function CategoriesTable({ data, isLoading = false }: CategoriesTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      columns={categoryColumns}
      data={data}
      isLoading={isLoading}
      onRowClick={(row) => navigate(`/categories/${row.original._id}`)}
      emptyContent={
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No categories found</p>
        </div>
      }
    />
  );
}
