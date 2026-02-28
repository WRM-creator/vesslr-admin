import { client } from "@/lib/api/client-config";

export type InformationRequestStatus = "PENDING" | "FULFILLED" | "DISMISSED";

export interface InformationRequest {
  _id: string;
  requestedFrom: "BUYER" | "SELLER";
  requestedBy: string;
  message: string;
  requiresDocuments: boolean;
  documentDescription: string | null;
  deadline: string | null;
  status: InformationRequestStatus;
  response: {
    message: string | null;
    attachments: { url: string; name: string }[];
    submittedBy: string;
    submittedAt: string;
  } | null;
  createdAt: string;
}

export interface Dispute {
  _id: string;
  transaction: {
    _id: string;
    status: string;
    type: string;
    product?: {
      _id: string;
      title: string;
      thumbnail?: string;
    };
  };
  initiator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  respondent: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  type?: string;
  raisedByRole?: "BUYER" | "SELLER";
  resolution?: {
    outcome: string;
    notes: string;
    resolvedAt: string;
    resolvedBy: string;
    metadata?: any;
  } | null;
  reason: string;
  status:
    | "open"
    | "under_review"
    | "resolved_refund"
    | "resolved_release"
    | "dismissed";
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  evidence: Array<{
    url: string;
    type: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  informationRequests: InformationRequest[];
}

export interface GetDisputesParams {
  page?: number;
  limit?: number;
  status?: string;
  respondent?: string;
  transactionId?: string;
}

export interface GetDisputesResponse {
  message: string;
  data: {
    docs: Dispute[];
    totalDocs: number;
    page: number;
    limit: number;
  };
}

export const getDisputes = async (params: GetDisputesParams) => {
  const { data } = await client.request<GetDisputesResponse>({
    url: "/api/v1/admin/disputes",
    method: "GET",
    query: params as unknown as Record<string, unknown>,
  });
  return data!;
};

export const getDispute = async (id: string) => {
  const { data } = await client.request<{ message: string; data: Dispute }>({
    url: `/api/v1/admin/disputes/${id}`,
    method: "GET",
  });
  return (data as any)!.data;
};

export const getDisputeStats = async () => {
  const { data } = await client.request<{
    message: string;
    data: {
      totalDocs: number;
      openDocs: number;
      resolvedDocs: number;
    };
  }>({
    url: "/api/v1/admin/disputes/stats",
    method: "GET",
  });
  return (data as any)!.data;
};

export const resolveDispute = async (
  id: string,
  payload: {
    outcome:
      | "PROCEED"
      | "CANCELLED"
      | "PARTIAL_REFUND"
      | "RE_INSPECT"
      | "MUTUAL_SETTLEMENT"
      | "ESCALATED";
    notes: string;
    metadata?: { buyerRefundAmount?: number };
  },
) => {
  const { data } = await client.request({
    url: `/api/v1/admin/disputes/${id}/resolve`,
    method: "PATCH",
    body: payload,
  });
  return data;
};

// Factory-compatible wrappers (return raw { data, error } for createMutation)
export const adminDisputesControllerCreateRequest = (args: {
  path: { id: string };
  body: {
    requestedFrom: "BUYER" | "SELLER";
    message: string;
    requiresDocuments: boolean;
    documentDescription?: string;
    deadline?: string;
  };
}) =>
  client.request({
    url: `/api/v1/admin/disputes/${args.path.id}/requests`,
    method: "POST",
    body: args.body,
  });

export const adminDisputesControllerDismissRequest = (args: {
  path: { id: string; requestId: string };
}) =>
  client.request({
    url: `/api/v1/admin/disputes/${args.path.id}/requests/${args.path.requestId}/dismiss`,
    method: "PATCH",
  });
