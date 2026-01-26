"use client";

import { Page } from "@/components/shared/page";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch only what's needed for the breadcrumb if possible, or just the whole customer
  const { data: customerData, isLoading } = api.organizations.detail.useQuery(
    {
      path: { id: id! },
    },
    {
      enabled: !!id,
    },
  );

  const customer = (customerData as any)?.data;
  useAppBreadcrumbLabel(id!, customer?.name);

  if (isLoading) {
    return (
      <Page>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </Page>
    );
  }

  if (!customer) {
    return (
      <Page>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold">Customer Not Found</h2>
          <p className="text-muted-foreground">
            The customer details could not be loaded.
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      {/* Blank page as requested */}
      <h1 className="p-6 text-2xl font-bold">{customer.name}</h1>
    </Page>
  );
}
