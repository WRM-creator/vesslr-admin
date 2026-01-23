"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import {
  type Transaction,
  TransactionsTable,
} from "../components/transactions-table";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "purchase",
    state: "closed",
    paymentStatus: "paid",
    complianceStatus: "approved",
    merchant: { name: "Acme Corp" },
    customer: { name: "John Doe" },
    value: 120.5,
  },
  {
    id: "tx_002",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    type: "transfer",
    state: "compliance_review",
    paymentStatus: "partial",
    complianceStatus: "pending_review",
    merchant: { name: "Global Industries" },
    customer: { name: "Jane Smith" },
    value: 75.0,
  },
  {
    id: "tx_003",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    type: "refund",
    state: "initiated",
    paymentStatus: "refunded",
    complianceStatus: "flagged",
    merchant: { name: "Tech Solutions" },
    customer: { name: "Bob Johnson" },
    value: 250.0,
  },
];

export default function TransactionsPage() {
  return (
    <Page>
      <PageHeader
        title="Transactions"
        description="View and manage customer transactions."
      />

      <TransactionsTable data={MOCK_TRANSACTIONS} />
    </Page>
  );
}
