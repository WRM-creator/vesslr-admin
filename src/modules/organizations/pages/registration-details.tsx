import { Page } from "@/components/shared/page";
import { useParams } from "react-router-dom";
import { ComplianceCaseReview } from "../components/compliance-case-review";

export default function RegistrationDetailsPage() {
  const { id: organizationId } = useParams<{ id: string }>();

  // The sticky case header (inside ComplianceCaseReview) owns the title, back
  // button, and status, so this page is just the frame.
  return (
    <Page>
      <ComplianceCaseReview organizationId={organizationId!} />
    </Page>
  );
}
