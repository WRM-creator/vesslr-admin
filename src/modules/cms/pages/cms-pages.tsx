import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PagesTable } from "../components/pages-table";
import type { CmsPageFilters } from "../components/pages-table/filters";
import type { CmsPageRow } from "../components/pages-table/columns";
import { Plus } from "lucide-react";

export default function CmsPagesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const page = parseInt(searchParams.get("page") || "1", 10);

  const filters: CmsPageFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
    }),
    [searchParams],
  );

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {
      page: String(page),
      limit: "10",
    };
    if (filters.search) params.search = filters.search;
    if (filters.status && filters.status !== "all")
      params.status = filters.status;
    return params;
  }, [filters, page]);

  const { data: pagesData, isLoading } = api.admin.cms.pages.list.useQuery({
    query: queryParams,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPages = ((pagesData as any)?.data?.docs as any[]) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalDocs = (pagesData as any)?.data?.totalDocs || 0;

  const pages: CmsPageRow[] = rawPages.map((p: any) => ({
    id: p._id,
    title: p.title || "Untitled",
    slug: p.slug,
    status: p.status || "draft",
    blockCount: p.blocks?.length || 0,
    updatedAt: p.updatedAt,
  }));

  const { mutate: deletePage, isPending: isDeleting } =
    api.admin.cms.pages.remove.useMutation({
      onSuccess: () => {
        toast.success("Page deleted");
        setDeletingId(null);
      },
      onError: () => toast.error("Failed to delete page"),
    });

  const handleFilterChange = (key: keyof CmsPageFilters, value: string) => {
    setSearchParams((prev) => {
      prev.delete("page");
      if (!value || value === "all") {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handlePageChange = (p: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
  };

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id);
  }, []);

  const confirmDelete = () => {
    if (deletingId) {
      deletePage({ path: { id: deletingId } });
    }
  };

  return (
    <Page>
      <PageHeader
        title="Pages"
        description="Manage your CMS pages."
        endContent={
          <Button asChild>
            <Link to="/cms/pages/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Page
            </Link>
          </Button>
        }
      />
      <div className="space-y-4">
        <PagesTable
          data={pages}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onDelete={handleDelete}
          onRowClick={(row) => navigate(`/cms/pages/${row.original.id}`)}
        />
        <DataPagination
          currentPage={page}
          totalItems={totalDocs}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      </div>

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete page?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The page will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
