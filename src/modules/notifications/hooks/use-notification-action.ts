import type { AdminNotification } from "@/modules/notifications/types";
import { useNavigate } from "react-router-dom";

/**
 * Admin notifications almost all concern a transaction (documents to review,
 * disputes, deposits, failed transfers), and for admin recipients `resourceId`
 * is the transaction id — the same target the notification email links to. So
 * transaction/dispute notifications open the admin transaction page; anything
 * else is a no-op for now.
 */
export const useNotificationAction = () => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: AdminNotification) => {
    const { type, resourceType, resourceId } = notification;

    const isTransactionScoped =
      resourceType === "transaction" ||
      type.startsWith("transaction.") ||
      type.startsWith("dispute.");

    if (isTransactionScoped && resourceId) {
      navigate(`/transactions/${resourceId}`);
      return;
    }

    console.warn("Unhandled admin notification type", type);
  };

  return { handleNotificationClick };
};
