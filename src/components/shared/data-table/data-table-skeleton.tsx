import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  /**
   * Number of columns to display
   */
  columnCount: number;

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

export function DataTableSkeleton({
  columnCount,
  rowCount = 5,
  showCheckbox = false,
}: DataTableSkeletonProps) {
  return (
    <>
      <TableHeader>
        <TableRow>
          {showCheckbox && (
            <TableHead className="w-[50px]">
              <Skeleton className="h-4 w-4" />
            </TableHead>
          )}
          {Array.from({ length: columnCount }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, i) => (
          <TableRow key={i}>
            {showCheckbox && (
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
            )}
            {Array.from({ length: columnCount }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}
