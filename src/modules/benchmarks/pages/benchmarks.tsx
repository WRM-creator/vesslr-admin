import { useState } from "react";
import { toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { AdminBenchmarkDto } from "@/lib/api/generated";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { BenchmarkFormDialog } from "../components/benchmark-form-dialog";

export default function BenchmarksPage() {
  const { data, isLoading } = api.admin.benchmarks.list.useQuery({});
  const benchmarks: AdminBenchmarkDto[] = data?.data ?? [];

  const { mutate: updateBenchmark, isPending: isToggling } =
    api.admin.benchmarks.update.useMutation();
  const { mutate: removeBenchmark, isPending: isDeleting } =
    api.admin.benchmarks.remove.useMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBenchmarkDto | null>(null);
  const [deleting, setDeleting] = useState<AdminBenchmarkDto | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (benchmark: AdminBenchmarkDto) => {
    setEditing(benchmark);
    setFormOpen(true);
  };

  const handleToggle = (benchmark: AdminBenchmarkDto, active: boolean) => {
    updateBenchmark(
      { path: { id: benchmark._id }, body: { active } },
      {
        onSuccess: () =>
          toast.success(
            active
              ? `${benchmark.name} is active for new deals`
              : `${benchmark.name} deactivated: no new deals, and unfunded differential orders on it cannot price`,
          ),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    removeBenchmark(
      { path: { id: deleting._id } },
      {
        onSuccess: () => {
          toast.success(`${deleting.name} deleted`);
          setDeleting(null);
        },
        onError: (err) => {
          toast.error(errorMessage(err));
          setDeleting(null);
        },
      },
    );
  };

  return (
    <Page>
      <PageHeader
        title="Benchmarks"
        description="Commodity price benchmarks that differential deals settle against. Referenced benchmarks are frozen; deactivate to retire."
        endContent={
          <Button onClick={openCreate}>
            <PlusIcon className="h-4 w-4" />
            New benchmark
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : benchmarks.length === 0 ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
          No benchmarks exist. Differential pricing cannot be used until one is
          created.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quoted</TableHead>
              <TableHead className="text-center">In use by</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {benchmarks.map((benchmark) => (
              <TableRow
                key={benchmark._id}
                className={benchmark.active ? "" : "opacity-50"}
              >
                <TableCell className="font-mono text-sm">
                  {benchmark.code}
                </TableCell>
                <TableCell className="font-medium">{benchmark.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {benchmark.benchmarkCurrency} / {benchmark.defaultUnit}
                </TableCell>
                <TableCell className="text-center">
                  {benchmark.usageCount > 0 ? (
                    <Badge variant="secondary">
                      {benchmark.usageCount} deal
                      {benchmark.usageCount === 1 ? "" : "s"}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">none</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={benchmark.active}
                    disabled={isToggling}
                    onCheckedChange={(next) => handleToggle(benchmark, next)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(benchmark)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={benchmark.usageCount > 0}
                      title={
                        benchmark.usageCount > 0
                          ? "Referenced by existing deals; deactivate instead"
                          : undefined
                      }
                      onClick={() => setDeleting(benchmark)}
                    >
                      <Trash2Icon className="text-destructive h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <BenchmarkFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        benchmark={editing}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this benchmark?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `${deleting.code} (${deleting.name}) is not referenced by any deal and will be removed permanently.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Delete benchmark
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}

function errorMessage(err: unknown): string {
  const message = (err as { message?: string | string[] })?.message;
  if (Array.isArray(message)) return message.join("; ");
  return message || "Request failed";
}
