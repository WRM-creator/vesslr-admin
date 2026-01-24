"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { useParams } from "react-router-dom";

export default function MerchantDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Page>
      <PageHeader title="Merchant Details" />
      Hi
    </Page>
  );
}
