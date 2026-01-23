import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Accordion } from "@/components/ui/accordion";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { AuditHistoryCard } from "../components/audit-history-card";
import { CategoryIdentityCard } from "../components/category-identity-card";
import { CategoryPageNavigation } from "../components/category-page-navigation";
import { CategorySection } from "../components/category-section";
import { ComplianceRequirementsCard } from "../components/compliance-requirements-card";
import { LogisticsRulesCard } from "../components/logistics-rules-card";
import { RiskControlsCard } from "../components/risk-controls-card";
import { TradeEligibilityCard } from "../components/trade-eligibility-card";
import { TransactionConfigCard } from "../components/transaction-config-card";
import { MOCK_CATEGORY_DATA } from "../lib/category-details-model";

const SECTIONS = [
  { value: "identity", title: "Identity & Scope" },
  { value: "eligibility", title: "Trade Eligibility" },
  { value: "transaction", title: "Transaction Config" },
  { value: "compliance", title: "Compliance" },
  { value: "logistics", title: "Logistics" },
  { value: "risk", title: "Risk Controls" },
  { value: "runtime", title: "Runtime Impact" },
  { value: "audit", title: "Audit History" },
];

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const [accordionValue, setAccordionValue] = useState<string[]>([
    "identity",
    "eligibility",
  ]);

  // In a real app we'd fetch based on ID, for now we use mock data
  const data = MOCK_CATEGORY_DATA;

  const handleNavigate = (value: string) => {
    // Ensure the section is expanded
    if (!accordionValue.includes(value)) {
      setAccordionValue((prev) => [...prev, value]);
    }

    // Small timeout to allow expansion rendering before scrolling
    setTimeout(() => {
      const element = document.getElementById(value);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <Page>
      <PageHeader
        title="Category Details"
        description={
          <>
            Configuration and policy controls for{" "}
            <span className="text-foreground font-semibold">
              {data.identity.name}
            </span>
          </>
        }
      />

      <div className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div className="min-w-0">
          <Accordion
            type="multiple"
            value={accordionValue}
            onValueChange={setAccordionValue}
            className="w-full space-y-4"
          >
            <CategorySection
              value="identity"
              title="Identity & Scope"
              description="Define what this category represents and where it applies."
              onEdit={() => console.log("Edit entity")}
            >
              <CategoryIdentityCard data={data.identity} />
            </CategorySection>

            <CategorySection
              value="eligibility"
              title="Trade Eligibility Rules"
              description="Define who is allowed to trade products in this category."
              onEdit={() => console.log("Edit eligibility")}
            >
              <TradeEligibilityCard data={data.eligibility} />
            </CategorySection>

            <CategorySection
              value="transaction"
              title="Transaction Configuration"
              description="Review allowed transaction types and value limits."
              onEdit={() => console.log("Edit transaction")}
            >
              <TransactionConfigCard data={data.transactionConfig} />
            </CategorySection>

            <CategorySection
              value="compliance"
              title="Compliance Requirements"
              description="Define what evidence and review processes are required."
              onEdit={() => console.log("Edit compliance")}
            >
              <ComplianceRequirementsCard data={data.compliance} />
            </CategorySection>

            <CategorySection
              value="logistics"
              title="Logistics & Fulfillment Rules"
              description="Define how physical delivery is handled."
              onEdit={() => console.log("Edit logistics")}
            >
              <LogisticsRulesCard data={data.logistics} />
            </CategorySection>

            <CategorySection
              value="risk"
              title="Risk & Oversight Controls"
              description="Define how closely this category is monitored."
              onEdit={() => console.log("Edit risk")}
            >
              <RiskControlsCard data={data.risk} />
            </CategorySection>

            {/* <CategorySection
              value="runtime"
              title={
                <span className="text-blue-700 dark:text-blue-400">
                  Runtime Impact Summary (Read-only)
                </span>
              }
              description="Show how the current configuration affects live system behavior."
              className="border-blue-200 opacity-90 dark:border-blue-900"
              onEdit={() => console.log("Edit runtime")}
            >
              <RuntimeImpactCard data={data.runtime} />
            </CategorySection> */}

            <CategorySection
              value="audit"
              title="Audit & Change History"
              description="Traceability and accountability for category rule changes."
              onEdit={() => console.log("Edit audit")}
            >
              <AuditHistoryCard data={data.audit} />
            </CategorySection>
          </Accordion>
        </div>

        <div className="sticky top-8 hidden lg:block">
          <CategoryPageNavigation
            sections={SECTIONS}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </Page>
  );
}
