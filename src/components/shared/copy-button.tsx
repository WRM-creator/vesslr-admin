"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
  label?: string;
}

export function CopyButton({
  value,
  className,
  variant = "outline",
  size = "icon",
  label,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
    toast.success("Copied to clipboard");
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={cn("relative z-10 h-6 w-6", className)}
      onClick={onCopy}
      {...props}
    >
      <span className="sr-only">Copy {label}</span>
      {hasCopied ? (
        <CheckIcon className="h-3 w-3" />
      ) : (
        <CopyIcon className="h-3 w-3" />
      )}
    </Button>
  );
}
