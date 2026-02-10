import { cn } from "@/lib/utils";

interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function PageLoader({ className, ...props }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "bg-background flex h-screen w-full items-center justify-center",
        className,
      )}
      {...props}
    >
      <img
        src="/gifs/loading.gif"
        alt="Loading..."
        className="size-32 object-contain"
      />
    </div>
  );
}
