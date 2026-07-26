import { cn } from "@/lib/utils";
import { useNotificationAction } from "@/modules/notifications/hooks/use-notification-action";
import type { AdminNotification } from "@/modules/notifications/types";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: AdminNotification;
  onRead?: (id: string) => void;
  onClose?: () => void;
}

export const NotificationItem = ({
  notification,
  onRead,
  onClose,
}: NotificationItemProps) => {
  const { handleNotificationClick } = useNotificationAction();

  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead(notification._id);
    }
    handleNotificationClick(notification);
    onClose?.();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex cursor-pointer flex-col gap-1 border-b p-4 transition-colors last:border-0",
        !notification.isRead
          ? "bg-primary/10 hover:bg-primary/20"
          : "hover:bg-muted",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-foreground text-sm font-medium">
          {notification.title}
        </span>
        <span className="text-muted-foreground shrink-0 text-xs">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {notification.message}
      </p>
    </div>
  );
};
