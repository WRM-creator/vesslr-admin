import { api } from "@/lib/api";
import { CategoriesTable } from "../components/categories-table";
import type { Category } from "../components/categories-table/columns";

export default function Categories() {
  const { data, isLoading } = api.categories.list.useQuery({});
  const categories = (data?.data ?? []) as Category[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      <CategoriesTable data={categories} isLoading={isLoading} />
    </div>
  );
}
