import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";

interface DataTableSkeletonProps<TData, TValue> {
  /**
   * Column definitions to calculate skeleton cells
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * Number of rows to display
   * @default 5
   */
  rowCount?: number;

  /**
   * Whether to show a checkbox column
   * @default false
   */
  showCheckbox?: boolean;
}

export function DataTableSkeleton<TData, TValue>({
  columns,
  rowCount = 5,
  showCheckbox = false,
}: DataTableSkeletonProps<TData, TValue>) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRow key={i} className="h-15 hover:bg-transparent">
          {showCheckbox && (
            <TableCell>
              <Skeleton className="h-4 w-4" />
            </TableCell>
          )}
          {columns.map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
