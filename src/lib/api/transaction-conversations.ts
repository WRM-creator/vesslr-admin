import { client } from "@/lib/api/client-config";

export interface AdminConversationMessage {
  _id: string;
  text: string;
  /** "Buyer" or "Seller" */
  authorName: string;
  /** APPROVED | PENDING_MODERATION | FLAGGED */
  status: string;
  createdAt: string;
}

export interface AdminTransactionConversation {
  _id: string;
  transactionId: string;
  messages: AdminConversationMessage[];
}

export const adminTransactionsControllerGetConversation = (args: {
  path: { id: string };
}) =>
  client.request<AdminTransactionConversation>({
    url: `/api/v1/admin/transactions/${args.path.id}/conversation`,
    method: "GET",
  });
