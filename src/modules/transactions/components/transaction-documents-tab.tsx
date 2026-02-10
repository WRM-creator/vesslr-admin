import type { TransactionResponseDto } from "@/lib/api/generated";
import { useState } from "react";
import { AddRequirementDialog } from "./add-requirement-dialog";
import { EditRequirementDialog } from "./edit-requirement-dialog";
import { TransactionPartyDocumentsCard } from "./transaction-party-documents-card";

interface TransactionDocumentsTabProps {
  transaction: TransactionResponseDto;
}

export function TransactionDocumentsTab({
  transaction,
}: TransactionDocumentsTabProps) {
  const [isAddRequirementOpen, setIsAddRequirementOpen] = useState(false);
  const [targetParty, setTargetParty] = useState<"BUYER" | "SELLER">("SELLER");
  const [requirementToEdit, setRequirementToEdit] = useState<any>(null);
  const [isEditRequirementOpen, setIsEditRequirementOpen] = useState(false);

  const openAddRequirement = (party: "BUYER" | "SELLER") => {
    setTargetParty(party);
    setIsAddRequirementOpen(true);
  };

  const handleEditRequirement = (requirement: any) => {
    setRequirementToEdit(requirement);
    setIsEditRequirementOpen(true);
  };

  const handleDeleteRequirement = (requirement: any) => {
    // This is now handled inside the dialog, but we could still trigger
    // other local state updates if needed.
  };

  const requiredDocs = transaction.requiredDocuments || [];

  const buyerDocs = requiredDocs.filter((doc) => doc.requiredFrom === "BUYER");
  const sellerDocs = requiredDocs.filter(
    (doc) => doc.requiredFrom === "SELLER",
  );
  const otherDocs = requiredDocs.filter(
    (doc) => doc.requiredFrom !== "BUYER" && doc.requiredFrom !== "SELLER",
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TransactionPartyDocumentsCard
        transactionId={transaction._id}
        title="Buyer Requirements"
        description="Documents required from the buyer."
        documents={buyerDocs}
        emptyMessage="No documents required from the buyer."
        onAdd={() => openAddRequirement("BUYER")}
        onEdit={handleEditRequirement}
        onDelete={handleDeleteRequirement}
      />

      <TransactionPartyDocumentsCard
        transactionId={transaction._id}
        title="Seller Requirements"
        description="Documents required from the seller."
        documents={sellerDocs}
        emptyMessage="No documents required from the seller."
        onAdd={() => openAddRequirement("SELLER")}
        onEdit={handleEditRequirement}
        onDelete={handleDeleteRequirement}
      />

      {otherDocs.length > 0 && (
        <TransactionPartyDocumentsCard
          transactionId={transaction._id}
          title="Other Requirements"
          description="Additional documents required for this transaction."
          documents={otherDocs}
          className="md:col-span-2"
        />
      )}

      <AddRequirementDialog
        transactionId={transaction._id}
        open={isAddRequirementOpen}
        onOpenChange={setIsAddRequirementOpen}
        defaultRequiredFrom={targetParty}
      />

      <EditRequirementDialog
        transactionId={transaction._id}
        requirement={requirementToEdit}
        open={isEditRequirementOpen}
        onOpenChange={setIsEditRequirementOpen}
      />
    </div>
  );
}
