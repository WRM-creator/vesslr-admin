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

  const { data, isLoading } = api.categories.list.useQuery({});

  const allCategories = data ?? [];

  // Client-side filtering
  const filteredCategories = allCategories.filter((item: any) => {
    const matchesType =
      type === "all" ||
      (type === "equipment-and-products" &&
        item.type === "equipment-and-products") ||
      (type === "services" && item.type === "services");

    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  const totalItems = filteredCategories.length;
  const itemsPerPage = 10;

  // Client-side pagination
  const categories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

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
          data={categories.map((item: any) => ({
            _id: item._id || "",
            name: item.name || "Unknown",
            slug: item.slug || "",
            type: item.type || "equipment-and-products",
            isActive: !!item.isActive,
          }))}
          isLoading={isLoading}
          activeTab={type ?? "all"}
          onTabChange={(val) => {
            setType(val);
            setPage(1); // Reset page on tab change
          }}
          search={search ?? ""}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        {!isLoading && totalItems > itemsPerPage && (
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
