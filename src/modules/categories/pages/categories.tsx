import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { CategoryGroupsTable } from "../components/category-groups-table";

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

  const { data, isLoading } = api.categoryGroups.findAll.useQuery({});

  const allGroups = data ?? [];

  // Client-side filtering
  const filteredGroups = allGroups.filter((item: any) => {
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

  const totalItems = filteredGroups.length;
  const itemsPerPage = 10;

  // Client-side pagination
  const groups = filteredGroups.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <Page>
      <PageHeader
        title="Category Groups"
        description="Manage product category groups and their configuration rules."
      />

      <div className="space-y-4">
        <CategoryGroupsTable
          data={groups.map((item: any) => ({
            _id: item._id || "",
            name: item.name || "Unknown",
            slug: item.slug || "",
            type: item.type || "equipment-and-products",
            isActive: !!item.isActive,
            image: item.image,
          }))}
          isLoading={isLoading}
          activeTab={type ?? "all"}
          onTabChange={(val: string) => {
            setType(val);
            setPage(1); // Reset page on tab change
          }}
          search={search ?? ""}
          onSearchChange={(val: string) => {
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
