import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/modules/notifications/hooks/use-notifications";
import { NotificationItem } from "../components/notification-item";

export default function NotificationsPage() {
  const {
    canView,
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    markAsRead,
  } = useNotifications();

  if (!canView) {
    return (
      <div className="text-muted-foreground p-6 text-sm">
        You do not have permission to view notifications.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            Compliance, funding, and settlement activity that needs attention.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-background rounded-xl border">
        {isLoading ? (
          <NotificationsSkeleton />
        ) : notifications.length === 0 ? (
          <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}

const NotificationsSkeleton = () => (
  <div aria-hidden>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2 border-b p-4 last:border-0">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-16 shrink-0" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    ))}
  </div>
);
