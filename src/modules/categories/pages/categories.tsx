import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";
import { PlusIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CategoriesTable } from "../components/categories-table";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("all"),
  );
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const { data, isLoading } = api.categories.list.useQuery({
    query: {
      page,
      limit: 10,
      type: type === "all" ? undefined : (type as any),
      search: search || undefined,
    },
  });

  const categories = data?.data?.docs ?? [];
  const totalItems = data?.data?.totalDocs ?? 0;
  const itemsPerPage = data?.data?.limit ?? 10;

  return (
    <Page>
      <PageHeader
        title="Categories"
        description="Manage product categories and their configuration rules."
        endContent={
          <Button asChild>
            <Link to="/categories/new">
              <PlusIcon /> Create Category
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <CategoriesTable
          data={categories.map((item) => ({
            _id: item._id || "",
            name: item.name || "Unknown",
            slug: item.slug || "",
            image: item.image,
            productCount: item.productCount || 0,
            type: (item.type as any) || "equipment-and-products",
          }))}
          isLoading={isLoading}
          activeTab={type}
          onTabChange={(val) => {
            setType(val);
            setPage(1); // Reset page on tab change
          }}
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        {!isLoading && totalItems > 0 && (
          <DataPagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        )}
      </div>
    </Page>
  );
}
