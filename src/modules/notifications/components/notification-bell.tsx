import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/modules/notifications/hooks/use-notifications";
import { BellIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationItem } from "./notification-item";

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    canView,
    notifications,
    unreadCount,
    isFetching,
    refetch,
    markAllAsRead,
    markAsRead,
  } = useNotifications();

  // Admins without notification:view don't get a bell at all.
  if (!canView) return null;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // The unread badge polls a separate endpoint from the list, so the list
      // can be stale when the bell opens — pull the freshest before showing it.
      refetch();
      markAllAsRead();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" strokeWidth={1.7} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h4 className="leading-none font-semibold">Notifications</h4>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
          >
            View all
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            isFetching ? (
              <NotificationsSkeleton />
            ) : (
              <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
                No notifications
              </div>
            )
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={markAsRead}
                onClose={() => setOpen(false)}
              />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

const NotificationsSkeleton = () => (
  <div aria-hidden>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2 border-b p-4 last:border-0">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-12 shrink-0" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    ))}
  </div>
);
