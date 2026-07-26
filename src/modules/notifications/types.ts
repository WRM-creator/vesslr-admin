export interface AdminNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}
