import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardGreeting() {
  const { data: profileData, isLoading } = api.auth.profile.useQuery({});
  const profile = profileData as unknown as
    | { name?: string; email?: string }
    | undefined;

  const displayName = profile?.name ?? profile?.email?.split("@")[0] ?? "Admin";

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight">
        {getGreeting()}, {displayName}
      </h1>
      <p className="text-muted-foreground text-sm">{currentDate}</p>
    </div>
  );
}
