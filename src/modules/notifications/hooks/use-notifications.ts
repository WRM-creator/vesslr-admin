import { api } from "@/lib/api";
import type { AdminNotification } from "@/modules/notifications/types";
import { useAdminPermissions } from "./use-admin-permissions";

export const NOTIFICATION_VIEW_PERMISSION = "notification:view";

/**
 * Admin notification data. Every query is gated on `notification:view` so an
 * admin without the permission never fires the guarded endpoints (which would
 * 403). Mirrors the user frontend hook shape.
 */
export const useNotifications = () => {
  const { hasPermission } = useAdminPermissions();
  const canView = hasPermission(NOTIFICATION_VIEW_PERMISSION);

  const { data: unreadCountData } = api.notifications.unreadCount.useQuery(
    undefined,
    { refetchInterval: 10_000, enabled: canView },
  );

  const {
    data: notificationsData,
    isLoading,
    isFetching,
    refetch,
  } = api.notifications.list.useQuery(
    { query: { limit: "20" } },
    { enabled: canView },
  );

  const markAllAsReadMutation = api.notifications.markAllAsRead.useMutation();
  const markAsReadMutation = api.notifications.markAsRead.useMutation();

  const unreadCount =
    (unreadCountData as { data?: { count?: number } })?.data?.count ?? 0;
  const notifications = ((
    notificationsData as { data?: { docs?: AdminNotification[] } }
  )?.data?.docs ?? []) as AdminNotification[];

  const markAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsReadMutation.mutate(undefined);
    }
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate({ path: { id } });
  };

  return {
    canView,
    notifications,
    unreadCount,
    isLoading,
    isFetching,
    refetch,
    markAllAsRead,
    markAsRead,
  };
};
