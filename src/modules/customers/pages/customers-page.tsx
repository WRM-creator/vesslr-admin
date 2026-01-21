"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { CustomersTable } from "../components/customers-table";
import { MOCK_CUSTOMERS } from "../lib/customer-model";

export function CustomersPage() {
  return (
    <Page>
      <PageHeader
        title="Customers"
        description="Manage all registered users, buyers, and sellers."
      />
      <CustomersTable data={MOCK_CUSTOMERS} />
    </Page>
  );
}
