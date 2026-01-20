import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  endContent?: ReactNode;
}

export function PageHeader({ title, description, endContent }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <div className="text-muted-foreground mt-2 text-base">
            {description}
          </div>
        )}
      </div>
      {endContent && (
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {endContent}
        </div>
      )}
    </div>
  );
}
