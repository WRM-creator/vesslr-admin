import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TruncatedListProps {
  items: Array<string>;
  maxVisible?: number;
  maxItemWidth?: number;
  emptyText?: string;
  className?: string;
  itemClassName?: string;
}

export const TruncatedList = ({
  items,
  maxVisible = 2,
  maxItemWidth = 80,
  emptyText = "-",
  className,
  itemClassName,
}: TruncatedListProps) => {
  if (!items || items.length === 0) {
    return <span className="text-muted-foreground">{emptyText}</span>;
  }

  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {visibleItems.map((item, index) => (
        <span key={index} className="flex items-center">
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div
                  className={cn("truncate text-sm font-medium", itemClassName)}
                  style={{ maxWidth: `${maxItemWidth}px` }}
                >
                  {item}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {index < visibleItems.length - 1 && (
            <span className="text-muted-foreground mr-1">,</span>
          )}
        </span>
      ))}

      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground bg-muted ml-1 cursor-help rounded-md px-1.5 py-0.5 text-xs whitespace-nowrap">
                +{remainingCount} more
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                {items.slice(maxVisible).map((item, i) => (
                  <span key={i} className="text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
