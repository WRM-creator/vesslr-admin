import { client } from "@/lib/api/client-config";

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
}

export interface GetDisputesParams {
  page?: number;
  limit?: number;
  status?: string;
  respondent?: string;
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
  payload: { status: string; resolutionNotes: string },
) => {
  const { data } = await client.request({
    url: `/api/v1/admin/disputes/${id}/resolve`,
    method: "PATCH",
    body: payload,
  });
  return data;
};
