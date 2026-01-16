"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ThumbnailProps {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

/**
 * Reusable thumbnail component with icon fallback
 */
export const Thumbnail = ({
  src,
  alt = "",
  className,
  size = "md",
}: ThumbnailProps) => {
  return (
    <Avatar className={cn("rounded-lg", sizeClasses[size], className)}>
      <AvatarImage src={src || ""} alt={alt} className="rounded-lg" />
      <AvatarFallback className="rounded-lg">
        <ImageIcon strokeWidth={1} className="text-muted-foreground size-4" />
      </AvatarFallback>
    </Avatar>
  );
};
