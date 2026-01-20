import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";

interface CategorySectionProps {
  value: string;
  title: string | ReactNode;
  description: string;
  children: ReactNode;
  className?: string;
  onEdit?: () => void;
}

export function CategorySection({
  value,
  title,
  description,
  children,
  className,
  onEdit,
}: CategorySectionProps) {
  return (
    <AccordionItem
      value={value}
      id={value}
      className={`bg-card rounded-lg border px-4 ${className || ""}`}
    >
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <span className="text-lg font-semibold">{title}</span>
          <span className="text-muted-foreground text-sm font-normal">
            {description}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2 border-t pt-2 pb-4">
        {children}
      </AccordionContent>
      {onEdit && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              onEdit();
            }}
          >
            <EditIcon />
            Edit
          </Button>
        </div>
      )}
    </AccordionItem>
  );
}
