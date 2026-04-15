export interface Escrow {
  id: string;
  transactionDisplayId?: number;
  transactionId?: string;
  transactionStatus?: string;
  sellerName: string;
  buyerName: string;
  productTitle?: string;
  amount: number;
  sellerAmount: number;
  serviceFeeAmount: number;
  currency: string;
  status: string;
  referenceId?: string;
  fundedAt?: string;
  releasedAt?: string;
  refundedAt?: string;
  createdAt: string;
}
